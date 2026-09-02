# Tesla Vehicle Simulator

## Overview

This project demonstrates building a full-stack application with testing as a core part of the development process.

The application simulates basic vehicle behavior through a React frontend and an Express REST API. Users can:

* Lock and unlock the vehicle
* Start and stop charging
* Automatically stop charging when the battery reaches 100%
* Turn climate control on and off
* View vehicle state as it changes

The goal is not to recreate a complete Tesla application. It is an exercise in full-stack architecture with testing at multiple levels.

## Architecture

The application is built with:

* React and TypeScript for the frontend
* Node.js, Express, and TypeScript for the backend REST API
* Prisma for database access
* PostgreSQL for persistent vehicle state

```text id="z19q4p"
React -> REST API -> Business Logic / Simulation -> Prisma -> PostgreSQL
```

The repository keeps the two applications separate:

```text id="6vf0n2"
frontend/  React + Vite application and Playwright tests
backend/   Express API, simulation, Prisma schema, and Vitest tests
```

Within the backend, vehicle HTTP handling and business logic live in `src/modules/vehicle`, the simulation lives in `src/simulation`, and the Prisma client configuration lives in `src/database`.

## Testing

Testing is one of the main focuses of this project.

* Vitest tests vehicle business logic and simulation behavior.
* Supertest with Vitest tests backend routes and HTTP responses.
* Playwright tests browser-level behavior. Some tests mock backend responses for deterministic UI testing, while full-stack tests can exercise the real API and persisted state.

## Getting Started

### Prerequisites

* Node.js and npm
* A running PostgreSQL database

### Backend

1. Install dependencies:

```bash id="6xrd0k"
cd backend
npm install
```

2. Create `backend/.env` and provide a PostgreSQL connection string:

```env id="nbis3d"
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tesla_vehicle_simulator"
```

3. Apply the committed migrations and generate the Prisma client:

```bash id="ruokg4"
npx prisma migrate deploy
npx prisma generate
```

4. Start the API:

```bash id="fsirqj"
npm run dev
```

The backend listens on http://localhost:3000.

### Frontend

In a second terminal:

```bash id="4ruqto"
cd frontend
npm install
npm run dev
```

Vite serves the frontend at http://localhost:5173, which is the origin allowed by the backend CORS configuration.

## Commands

### Backend

```bash id="5n7b5m"
npm run build      # Compile TypeScript to backend/dist
npm run typecheck  # Check application TypeScript
npm test           # Run Vitest and Supertest suites
```

### Frontend

```bash id="978ef5"
npm run build          # Type-check and create a production Vite build
npm run lint           # Run ESLint
npx playwright test    # Run browser tests; start the Vite dev server first
```

## API

The backend exposes these vehicle endpoints under `/api/vehicle`:

| Method  | Endpoint          | Purpose                                           |
| ------- | ----------------- | ------------------------------------------------- |
| `GET`   | `/`               | Retrieve the current vehicle state                |
| `PATCH` | `/lock`           | Update lock state with `{ "locked": true/false }` |
| `POST`  | `/charging/start` | Start charging                                    |
| `POST`  | `/charging/stop`  | Stop charging                                     |
| `POST`  | `/climate/start`  | Turn climate control on                           |
| `POST`  | `/climate/stop`   | Turn climate control off                          |

## Project Structure

```text id="2hubjp"
tesla-vehicle-simulator/
├── frontend/
│   ├── src/                 React application
│   └── tests/               Playwright browser tests
│
├── backend/
│   ├── prisma/              Prisma schema and migrations
│   └── src/
│       ├── database/        Prisma client configuration
│       ├── modules/
│       │   └── vehicle/     Vehicle routes and business logic
│       ├── simulation/      Vehicle simulation behavior
│       ├── tests/
│       │   ├── unit/        Unit tests
│       │   └── integration/ Route and HTTP integration tests
│       ├── app.ts           Express application setup
│       └── server.ts        Server startup and simulation timer
│
└── README.md
```

## Future Improvements

Possible next steps for the project include:

* Add more vehicle behaviors and simulation rules
* Expand climate-control functionality
* Add full-stack Playwright tests using the real backend and database
* Add CI so builds and tests run automatically on every push
* Deploy the frontend, backend, and PostgreSQL database
* Improve the frontend UI and add clearer vehicle-state visualization
* Add API documentation and stronger error handling
