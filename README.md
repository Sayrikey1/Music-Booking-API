# 🎵 Music Booking Backend 🎫

This project is a backend application for managing music events, including creating, updating, retrieving, and deleting events. It is built using **Node.js**, **Express**, and **TypeORM**, with **PostgreSQL** as the database. The application supports authentication and authorization for admin users and includes test coverage for key endpoints.

---

## 📋 Table of Contents

- ✨ Features
- 🛠️ Technologies Used
- ⚙️ Setup and Installation
- 🔑 Environment Variables
- 📡 API Endpoints
- 🧪 Testing
- 📂 Project Structure
- 📜 License
- 👨‍💻 Developer

---

## ✨ Features

- 🔐 **Admin Authentication**: Admin users can log in and manage events.
- 🎤 **Event Management**:
  - Create new events.
  - Retrieve event details.
  - Update event details (including merging artists).
  - Delete events.
- 🗄️ **Database Integration**: Uses PostgreSQL with TypeORM for database operations.
- 🌍 **Environment-Specific Configurations**: Supports test and production environments.
- ✅ **Unit and Integration Tests**: Comprehensive test coverage using Jest and Supertest.

---

## 🛠️ Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for handling HTTP requests.
- **TypeORM**: ORM for database interactions.
- **PostgreSQL**: Relational database for storing event data.
- **Jest**: Testing framework for unit and integration tests.
- **Supertest**: HTTP assertions for testing API endpoints.
- **dotenv**: For managing environment variables.

---

## ⚙️ Setup and Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/sayrikey1/music-booking-backend.git
   cd music-booking-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database for development and testing.
   - Update the environment variables in the .env file (see 🔑 Environment Variables).

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. The server will run at `http://localhost:3000`.

---

## 🔑 Environment Variables

Create a .env file in the root directory and configure the following variables:

```env
# General
NODE_ENV=development
PORT=3000

# PostgreSQL (Development)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=music_booking

# PostgreSQL (Testing)
TEST_POSTGRES_HOST=localhost
TEST_POSTGRES_PORT=5432
TEST_POSTGRES_USERNAME=your_username
TEST_POSTGRES_PASSWORD=your_password
TEST_POSTGRES_DATABASE=music_booking_test

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

---

## 📡 API Endpoints

### 🔐 Authentication

- **POST** `/api/login`: Log in as an admin user.
- **POST** `/api/create`: Create a new admin user.

### 🎤 Event Management

- **POST** `/api/event/create`: Create a new event.
- **GET** `/api/event/:id`: Retrieve details of an event by ID.
- **PATCH** `/api/event/update`: Update an event (merges artists).
- **DELETE** `/api/event/delete/:id`: Delete an event by ID.

---

## 🧪 Testing

### Running Tests

To run the test suite, use the following command:

```bash
npm run test
```

### Test Coverage

The project includes tests for:

- Admin authentication.
- Event creation, retrieval, updating, and deletion.
- Database interactions.

### Example Test Case

The following test ensures that updating an event merges the `artists` array:

```typescript
it("should update the event and merge artists when authenticated", async () => {
  const response = await request(app)
    .patch(`/api/event/update`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      id: eventId,
      artists: ["New Artist"],
    });

  expect(response.status).toBe(StatusCodes.OK);
  expect(response.body.artists).toEqual(
    expect.arrayContaining(["Burna Boy", "Wizkid", "New Artist"])
  );
});
```

---

## 📂 Project Structure

```plaintext
music_booking/
├── src/
│   ├── entity/               # TypeORM entities (e.g., Event, User)
│   ├── migration/            # Database migrations
│   ├── routes/               # API route handlers
│   ├── types/                # TypeScript interfaces and types
│   ├── data-source.ts        # TypeORM DataSource configuration
│   └── index.ts              # Entry point of the application
├── tests/                    # Test files
├── .env                      # Environment variables
├── package.json              # Project metadata and scripts
└── README.md                 # Project documentation
```

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 👨‍💻 Developer

Developed with ❤️ by [sayrikey1](https://github.com/sayrikey1).