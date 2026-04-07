# Schedule API Documentation

## Overview
The Schedule API allows trainers to create and manage course schedules (live classes, sessions, office hours) and students to view, RSVP, and attend these sessions.

---

## Base URL
```
/api/schedules
```

---

## API Endpoints

### 1. Get Course Schedules
**Endpoint:** `GET /course/:courseId`  
**Access:** Public  
**Description:** Get all schedules for a specific course

**Query Parameters:**
- `status` (optional): Filter by status - `scheduled`, `in_progress`, `completed`, `cancelled`
- `startDate` (optional): Filter schedules after a specific date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "schedule_id",
      "title": "Introduction to JavaScript",
      "topic": "Variables and Data Types",
      "startDate": "2024-04-10T10:00:00Z",
      "endDate": "2024-04-10T11:30:00Z",
      "duration": 90,
      "course": { "_id": "course_id", "title": "JS Basics" },
      "trainer": { "_id": "trainer_id", "name": "John Doe", "email": "john@example.com" },
      "meetingLink": "https://zoom.us/j/123456",
      "platformType": "zoom",
      "status": "scheduled",
      "rsvps": []
    }
  ]
}
```

---

### 2. Get Student's Schedules
**Endpoint:** `GET /student/my`  
**Access:** Private (Student)  
**Description:** Get all schedules the student is enrolled in

**Query Parameters:**
- `status` (optional): Filter by status
- `upcoming` (optional): `true` to show only future schedules

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "schedule_id",
      "title": "Class Title",
      "studentRsvpStatus": "attending",  // null, "attending", "not_attending", "maybe"
      // ... other schedule fields
    }
  ]
}
```

---

### 3. Get Trainer's Schedules
**Endpoint:** `GET /trainer/my`  
**Access:** Private (Trainer)  
**Description:** Get all schedules created by the trainer

**Query Parameters:**
- `status` (optional): Filter by status
- `startDate` (optional): Filter schedules after a specific date

**Response:** Array of schedule objects with full RSVP and attendance details

---

### 4. Get Schedule Details
**Endpoint:** `GET /:scheduleId`  
**Access:** Public  
**Description:** Get detailed information about a specific schedule

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "schedule_id",
    "title": "Advanced JavaScript",
    "description": "Deep dive into closures and async/await",
    "topic": "Closures & Async Programming",
    "startDate": "2024-04-15T14:00:00Z",
    "endDate": "2024-04-15T16:00:00Z",
    "duration": 120,
    "isRecurring": true,
    "recurrencePattern": "weekly",
    "recurrenceEndDate": "2024-06-15T14:00:00Z",
    "daysOfWeek": [1, 3, 5],  // Monday, Wednesday, Friday
    "course": { "_id": "course_id", "title": "JavaScript Mastery" },
    "trainer": { "_id": "trainer_id", "name": "Jane Smith" },
    "meetingLink": "https://zoom.us/j/789012",
    "platformType": "zoom",
    "maxCapacity": 50,
    "rsvps": [
      {
        "student": { "_id": "student_id", "name": "Student Name" },
        "status": "attending",
        "rsvpedAt": "2024-04-08T10:30:00Z"
      }
    ],
    "attendance": [
      {
        "student": { "_id": "student_id", "name": "Student Name" },
        "status": "present",
        "presentAt": "2024-04-15T14:02:00Z"
      }
    ],
    "status": "scheduled",
    "tags": ["important", "mandatory"]
  }
}
```

---

### 5. Create Schedule (Trainer)
**Endpoint:** `POST /`  
**Access:** Private (Trainer)  
**Description:** Create a new schedule for a course

**Request Body:**
```json
{
  "title": "Live Coding Session",
  "description": "Building a todo app with React",
  "topic": "React - Todo App Project",
  "startDate": "2024-04-20T18:00:00Z",
  "endDate": "2024-04-20T19:30:00Z",
  "duration": 90,
  "course": "course_id",
  "meetingLink": "https://zoom.us/j/123456789",
  "platformType": "zoom",
  "location": "Room 301",
  "maxCapacity": 30,
  "isRecurring": false,
  "recurrencePattern": "none",
  "notes": "Bring your questions!",
  "tags": ["project", "practical"]
}
```

**Response:** Created schedule object

**Recurring Schedule Example:**
```json
{
  "title": "Weekly Class",
  "startDate": "2024-04-20T10:00:00Z",
  "endDate": "2024-04-20T11:00:00Z",
  "duration": 60,
  "course": "course_id",
  "isRecurring": true,
  "recurrencePattern": "weekly",
  "recurrenceEndDate": "2024-08-20T10:00:00Z",
  "daysOfWeek": [1, 3, 5],  // Mon, Wed, Fri
  "meetingLink": "https://zoom.us/j/123456789"
}
```

---

### 6. Update Schedule (Trainer)
**Endpoint:** `PUT /:scheduleId`  
**Access:** Private (Trainer)  
**Description:** Update schedule details

**Request Body:** (Any fields to update)
```json
{
  "title": "Updated Title",
  "meetingLink": "https://zoom.us/j/new123",
  "description": "Updated description"
}
```

**Constraints:**
- Cannot update completed schedules
- Trainer must own the schedule

---

### 7. Delete Schedule (Trainer)
**Endpoint:** `DELETE /:scheduleId`  
**Access:** Private (Trainer)  
**Description:** Delete a schedule (only before it starts)

**Constraints:**
- Cannot delete in-progress or completed schedules
- Trainer must own the schedule

---

### 8. RSVP to Schedule (Student)
**Endpoint:** `POST /:scheduleId/rsvp`  
**Access:** Private (Student)  
**Description:** Student RSVPs to a schedule

**Request Body:**
```json
{
  "status": "attending"  // "attending", "not_attending", or "maybe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "RSVP updated successfully",
  "data": { /* updated schedule */ }
}
```

---

### 9. Mark Attendance (Trainer)
**Endpoint:** `POST /:scheduleId/attendance/:studentId`  
**Access:** Private (Trainer)  
**Description:** Mark a student's attendance for a schedule

**Request Body:**
```json
{
  "status": "present"  // "present", "absent", or "late"
}
```

**Response:** Updated schedule with attendance records

---

### 10. Cancel Schedule (Trainer)
**Endpoint:** `POST /:scheduleId/cancel`  
**Access:** Private (Trainer)  
**Description:** Cancel a scheduled session

**Request Body:**
```json
{
  "reason": "Trainer is sick"  // Optional cancellation reason
}
```

**Response:**
```json
{
  "success": true,
  "message": "Schedule cancelled successfully",
  "data": { /* updated schedule */ }
}
```

---

## Data Models

### Schedule Schema
```javascript
{
  // Basic Info
  title: String,              // Required
  description: String,        // Optional
  topic: String,              // Required
  
  // Timing
  startDate: Date,            // Required
  endDate: Date,              // Required
  duration: Number,           // in minutes
  
  // Recurrence
  isRecurring: Boolean,       // default: false
  recurrencePattern: String,  // "daily", "weekly", "biweekly", "monthly", "none"
  recurrenceEndDate: Date,    // When recurring ends
  daysOfWeek: [Number],       // 0=Sun, 1=Mon, ..., 6=Sat (for weekly recurrence)
  
  // Relations
  course: ObjectId (ref: Course),
  trainer: ObjectId (ref: User),
  lesson: ObjectId (ref: Lesson),
  
  // Meeting Details
  meetingLink: String,        // Zoom/Meet/Teams URL
  platformType: String,       // "zoom", "meet", "teams", "custom", "none"
  location: String,           // Physical location if offline
  
  // Capacity
  maxCapacity: Number,
  attendedCount: Number,
  
  // RSVP & Attendance
  rsvps: [{
    student: ObjectId,
    status: String,           // "attending", "not_attending", "maybe"
    rsvpedAt: Date
  }],
  
  attendance: [{
    student: ObjectId,
    status: String,           // "present", "absent", "late"
    presentAt: Date
  }],
  
  // Status
  status: String,             // "scheduled", "in_progress", "completed", "cancelled"
  isCancelled: Boolean,
  cancellationReason: String,
  
  // Additional
  notes: String,
  tags: [String],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## Usage Examples

### Example 1: Create a Weekly Class
```bash
POST /api/schedules
Content-Type: application/json
Authorization: Bearer {trainer_token}

{
  "title": "Advanced React Fundamentals",
  "description": "Weekly dive into React hooks and patterns",
  "topic": "React Hooks & State Management",
  "startDate": "2024-04-22T15:00:00Z",
  "endDate": "2024-04-22T16:30:00Z",
  "duration": 90,
  "course": "661a8c4e2f5b8c0012345678",
  "meetingLink": "https://zoom.us/j/123456789",
  "platformType": "zoom",
  "isRecurring": true,
  "recurrencePattern": "weekly",
  "recurrenceEndDate": "2024-09-30T15:00:00Z",
  "daysOfWeek": [1, 3, 5],
  "maxCapacity": 50
}
```

### Example 2: Student RSVPs to Class
```bash
POST /api/schedules/661b8d5f3g6c9d0023456789/rsvp
Content-Type: application/json
Authorization: Bearer {student_token}

{
  "status": "attending"
}
```

### Example 3: Get Upcoming Student Schedules
```bash
GET /api/schedules/student/my?upcoming=true
Authorization: Bearer {student_token}
```

### Example 4: Mark Attendance After Class
```bash
POST /api/schedules/661b8d5f3g6c9d0023456789/attendance/661c8e6g4h7d0e0034567890
Content-Type: application/json
Authorization: Bearer {trainer_token}

{
  "status": "present"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Start date must be before end date"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to update this schedule"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Schedule not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Notes
- All times are in ISO 8601 format (UTC)
- Trainers must be enrolled as course trainers to create schedules
- Students automatically see schedules for courses they're enrolled in
- Email notifications are sent when schedules are created/updated/cancelled (future feature)
- Calendar view is available on the frontend
