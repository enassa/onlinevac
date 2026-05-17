# OnlineVac Backend

Node.js Express API for OnlineVac using MongoDB and Mongoose.

## Setup

Copy `.env.example` to `.env` and update values.

Install dependencies manually:

```powershell
npm install
```

Run manually when ready:

```powershell
npm run dev
```

## Migration Notes

The frontend currently has local Redux-backed simulated APIs. This backend is designed to become the source of truth while preserving the same public `id` fields and timetable generation response shape.

The scheduler is copied server-side so timetable generation can run against persisted MongoDB data. The frontend scheduler should remain as a backup until the HTTP migration is fully verified.
