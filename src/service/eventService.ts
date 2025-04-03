import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data-source";
import { ICreateEvent, IUpdateEvent } from "src/types";
import { Event } from "../entity/Event";
import { handleError, updateEntity } from "../utils/serviceUtils";
import { User } from "../entity/User";
import { Artist } from "../entity/Artist";

dotenv.config();

export interface IEvent {
    CreateEvent: (userId: string, load: ICreateEvent) => Promise<any>;
    GetEvent: (id: string) => Promise<any>;
    GetAllEvents: () => Promise<any>;
    UpdateEvent: (userId: string, load: IUpdateEvent) => Promise<any>;
    DeleteEvent: (userId: string, id: string) => Promise<any>;
    GetEventWaitlist: (eventId: string) => Promise<any>;
}

export class EventService implements IEvent {
    private userRepository = AppDataSource.getRepository(User)
    private eventRepository = AppDataSource.getRepository(Event);
    private artistRepository = AppDataSource.getRepository(Artist);

    private async findEventById(id: string) {
        return this.eventRepository.findOne({ where: { id }, relations: ["user", "artists"]
        });
    }


    private async checkEventOwnership(event: Event, userId: string) {
        if (event.user.id !== userId) {
            throw new Error("You are not authorized to modify this event");
        }
    }

    async CreateEvent(userId: string, load: ICreateEvent) {
        try {
            // Find the user by the userId
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return {
                    status: StatusCodes.NOT_FOUND,
                    message: "User not found",
                };
            }

            const artists = await this.artistRepository.find({
                where: load.artists?.map(artistName => ({ artist_name: artistName })) || []
            });

            const event = this.eventRepository.create({
                ...load,
                availableTickets: load.totalTickets,
                user: user,
                artists: artists, // assign existing artists
            });


            // Save the event
            const createdEvent = await this.eventRepository.save(event);

            return {
                status: StatusCodes.CREATED,
                message: "Event created successfully",
                id: createdEvent.id,
            };
        } catch (err: any) {
            return handleError(err);
        }
    }


    async GetEvent(id: string) {
        try {
            const event = await this.findEventById(id);
            if (!event) {
                return {
                    status: StatusCodes.NOT_FOUND,
                    message: "Event not found",
                    id: "",
                };
            }
            return {
                status: StatusCodes.OK,
                message: "Event found",
                event,
            };
        } catch (err: any) {
            return handleError(err);
        }
    }

    async GetAllEvents() {
        try {
            const events = await this.eventRepository.find();
            return {
                status: StatusCodes.OK,
                message: "Events found",
                events,
            };
        } catch (err: any) {
            return handleError(err);
        }
    }

    async UpdateEvent(userId: string, load: IUpdateEvent) {
        try {
            const event = await this.findEventById(load.id);
            if (!event) {
                return { status: StatusCodes.NOT_FOUND, message: "Event not found" };
            }

            await this.checkEventOwnership(event, userId);

            const { artists: artistNames, ...updateData } = load;

            // Update event properties
            updateEntity(event, updateData);

            // Update artists if provided
            if (artistNames?.length) {
                const foundArtists = await this.artistRepository.find({
                    where: artistNames.map(artistName => ({ artist_name: artistName }))
                });

                event.artists = [
                    ...(event.artists || []),
                    ...foundArtists.filter(
                        artist => !event.artists?.some(existing => existing.id === artist.id)
                    )
                ];
            }

            // Save updated event
            await this.eventRepository.save(event);

            // Fetch updated event with relations
            const updatedEvent = await this.eventRepository.findOne({
                where: { id: event.id },
                relations: ["user", "artists"]
            });

            return {
                status: StatusCodes.OK,
                message: "Event updated successfully",
                id: updatedEvent?.id,
                location: updatedEvent?.location,
                totalTickets: updatedEvent?.totalTickets,
                artists: updatedEvent?.artists?.map(artist => artist.artist_name) || []
            };
        } catch (err: any) {
            return handleError(err);
        }
    }


    async DeleteEvent(userId: string, id: string) {
        try {
            const event = await this.findEventById(id);
            if (!event) {
                return { status: StatusCodes.NOT_FOUND, message: "Event not found" };
            }

            await this.checkEventOwnership(event, userId);

            await this.eventRepository.delete(id);
            return { status: StatusCodes.OK, message: "Event deleted successfully" };
        } catch (err: any) {
            return handleError(err);
        }
    }

    async GetEventWaitlist(eventId: string) {
        try {
            const event = await this.findEventById(eventId);
            if (!event) {
                return { status: StatusCodes.NOT_FOUND, message: "Event not found" };
            }

            const waitlist = event.waitlist;
            return { status: StatusCodes.OK, message: "Waitlist found", waitlist };
        } catch (err: any) {
            return handleError(err);
        }
    }
}
