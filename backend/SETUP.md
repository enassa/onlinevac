# Backend Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or accessible via connection string)

## Installation

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install dependencies manually:
   ```powershell
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/onlinevac
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRES_IN=7d
   ```

## Running the Backend

Start the backend server manually when ready:
```powershell
npm run dev
```

The API will be available at `http://localhost:4000/api`

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Bootstrap (Frontend Hydration)
- `PUT /api/bootstrap` - Replace all backend data with frontend dummy state (one-time setup)

### Subjects
- `GET /api/subjects` - List all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create subject
- `PATCH /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Programmes
- `GET /api/programmes` - List all programmes
- `GET /api/programmes/:id` - Get programme by ID
- `POST /api/programmes` - Create programme
- `PATCH /api/programmes/:id` - Update programme
- `DELETE /api/programmes/:id` - Delete programme

### Teachers
- `GET /api/teachers` - List all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher
- `PATCH /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Students
- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PATCH /api/students/:id` - Update student
- `PATCH /api/students/:id/programme` - Join programme
- `DELETE /api/students/:id` - Delete student

### Vacation Classes
- `GET /api/vacation-classes` - List all vacation classes
- `GET /api/vacation-classes/active` - Get active vacation class
- `GET /api/vacation-classes/:id` - Get vacation class by ID
- `GET /api/vacation-classes/:id/report` - Get generation report
- `POST /api/vacation-classes` - Create vacation class
- `POST /api/vacation-classes/:id/generate-timetable` - Generate timetable
- `PATCH /api/vacation-classes/:id` - Update vacation class
- `PATCH /api/vacation-classes/:id/status` - Update status
- `PATCH /api/vacation-classes/:id/availability` - Update teacher availability
- `PATCH /api/vacation-classes/:id/preferences` - Update subject preferences
- `DELETE /api/vacation-classes/:id` - Delete vacation class

### Timetables
- `GET /api/timetables` - List all timetables
- `GET /api/timetables/vacation-class/:vacationClassId` - Get timetable by vacation class
- `GET /api/timetables/:id` - Get timetable by ID
- `PATCH /api/timetables/:id/slots/:slotId` - Update time slot
- `DELETE /api/timetables/vacation-class/:vacationClassId` - Delete timetables for vacation class
- `DELETE /api/timetables/:id` - Delete timetable

## Frontend Integration

The frontend is configured to use the backend via the `VITE_BACKEND_URL` environment variable. The frontend API modules have been refactored to:
1. Try HTTP calls to the backend first
2. Fall back to Redux/local state if the backend is unavailable
3. Update Redux state after successful HTTP mutations

This ensures graceful degradation during migration.
