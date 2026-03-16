# Rappi-like Delivery Ecosystem

A monorepo containing the backend API and multiple frontend static applications for a delivery ecosystem inspired by Rappi.

## Project Structure

```
rappi-ecosystem/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── app.ts           # Express application setup
│   │   ├── server.ts        # Server entry point
│   │   ├── config/
│   │   │   ├── database.ts  # PostgreSQL connection
│   │   │   └── index.ts     # Config exports
│   │   ├── routes/          # Route definitions
│   │   └── features/        # Feature modules (domains)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/
    ├── consumer-app/   # Customer-facing app
    ├── store-app/      # Store/restaurant management app
    └── delivery-app/   # Delivery driver app
```

## Getting Started

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Fill in your PostgreSQL credentials in `.env`.

5. Run in development mode:
   ```bash
   npm run dev
   ```

### Frontend

Each frontend app is a standalone static web app. Simply open its `index.html` in a browser, or serve with any static HTTP server:

```bash
npx serve frontend/consumer-app
npx serve frontend/store-app
npx serve frontend/delivery-app
```

## API Health Check

```
GET http://localhost:3000/health
```

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Backend   | Node.js, Express, TypeScript       |
| Database  | PostgreSQL (via `pg`)              |
| Frontend  | HTML, CSS, JavaScript (vanilla)    |
| Auth/IDs  | `uuid`                             |
