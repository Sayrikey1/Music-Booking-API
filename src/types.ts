import { ArtistRating, Genre } from "./entity/Artist";
import { UserType } from "./entity/User";

export interface ILogin {
    email: string;
    password: string;
}

export interface ICreateUser {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    user_type: UserType;
}

export interface IUpateUser {
    id: string;
    username: string;
    address: string;
}

export interface IVerifyOtp {
    email: string;
    otp: string;
}

export interface VerifyOtpResponse {
    status: number;
    message: string;
}

export interface IResetPassword {
    password: string;
    token: string;
}

//-----------------------------------------------

export interface ICreateEvent {
    name: string;
    description: string;
    date: Date;
    duration: number;
    location: string;
    ticket_price: number;
    totalTickets: number;
    artists?: string[];
}


export interface IUpdateEvent {
    id: string;
    date: Date;
    duration: number;
    location: string;
    totalTickets: number;
    ticket_price: number;
    artists?: string[];
}

//----------------------------------------------


export interface ICreateArtist {
    artist_name: string;
    rating?: ArtistRating; 
    nationality: string;
    genre: Genre[]; 
    // eventIds?: number[];
}

export interface IUpdateArtist {
    artist_name?: string;
    rating?: ArtistRating;
    nationality?: string;
    genre?: Genre[];
    // eventIds?: number[];
}


//-----------------------------------------------

export interface ICreateBooking {
    event_id: string;
    ticket_count: number;
}

export interface IUpdateBooking {
    event_id: string;
    ticket_count: number;
}

//-------------------------------------------
export interface IPayment {
    /**
   * Process a payment.
   * @param amount Payment amount in the smallest currency unit (e.g., cents)
   * @param currency Currency code (e.g., 'usd', 'ngn')
   * @param source Payment source or token (e.g., token from client)
   */
    amount: number;
    currency: string;
    source: string;
}

export interface IPaymentService {
    ProcessPayment: (load: IPayment) => Promise<any>;
}
