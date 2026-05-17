# Online Vacation Class Management System — Full Specification

## 1. System Overview

A web-based platform for managing vacation (summer/bridge) classes. The system enables administrators to define academic structure (subjects, programmes, teachers), create vacation class periods, auto-generate clash-free weekly timetables, and allow students to join programmes and view their schedules.

**Core Principle**: No student should ever have two or more subjects scheduled at the same time. The scheduling algorithm enforces this through three rules:
1. **Core–Core Rule**: No two core subjects may run simultaneously.
2. **Core–Elective Rule**: No core subject and any elective subject may run simultaneously.
3. **Elective–Elective Rule**: No two elective subjects belonging to the same programme may run simultaneously.
4. **Cross-Programme Electives**: Elective subjects from different programmes MAY run simultaneously (no student takes both).

---

## 2. Roles & Responsibilities

### 2.1 System Admin
- **What they do**:
  - Create, edit, delete subjects (core/elective, credit hours)
  - Create, edit, delete programmes (name + elective subject selection; core subjects auto-included)
  - Create, edit, delete teachers (name, email, subjects they teach)
  - Create vacation class periods (select programmes, select teachers, set teacher availability, set teacher subject preferences)
  - Generate timetables automatically
  - View and manage generated timetables
  - View enrolled students
- **What they see**:
  - Admin Dashboard (stats overview)
  - Subjects management page
  - Programmes management page
  - Teachers management page
  - Vacation Class management page
  - Timetable viewer/editor
  - Students overview

### 2.2 Teacher
- **What they do**:
  - View their assigned schedule for active vacation class
  - Set/update their availability (days + hours per day)
  - Select which of their subjects they want to teach for a given vacation class period
- **What they see**:
  - Teacher Dashboard (today's classes, weekly overview)
  - My Schedule page (full weekly timetable)
  - Availability & Preferences page

### 2.3 Student
- **What they do**:
  - Browse available vacation class periods
  - Join a programme within a vacation class period
  - View their personal timetable
- **What they see**:
  - Student Dashboard (my programme, next class, weekly view)
  - My Timetable page
  - Join Programme page (browse & enroll)

---

## 3. Entity Definitions

### 3.1 Subject
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| name | string | Subject name (e.g., "Mathematics") |
| creditHours | number | Hours per week (1–10) |
| type | 'core' \| 'elective' | Core subjects are mandatory for all programmes |

### 3.2 Programme
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| name | string | Programme name (e.g., "General Science with ICT") |
| electiveSubjectIds | string[] | IDs of elective subjects specific to this programme |
| coreSubjectIds | string[] | Auto-populated: all core subject IDs |

### 3.3 Teacher
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| name | string | Full name |
| email | string | Email address |
| subjectIds | string[] | All subjects this teacher is qualified to teach |
| subjectCount | number | Derived: length of subjectIds |

### 3.4 TeacherAvailability (per vacation class)
| Field | Type | Description |
|-------|------|-------------|
| teacherId | string | Teacher reference |
| day | string | Day of week (Monday–Saturday) |
| startHour | number | Available from (0–23) |
| endHour | number | Available until (0–23) |

### 3.5 TeacherSubjectPreference (per vacation class)
| Field | Type | Description |
|-------|------|-------------|
| teacherId | string | Teacher reference |
| subjectIds | string[] | Subjects they want to teach (subset of their qualified subjects) |

### 3.6 VacationClass
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| name | string | Period name (e.g., "Summer 2025 Vacation Class") |
| startDate | string | ISO date |
| endDate | string | ISO date |
| programmeIds | string[] | Selected programmes |
| teacherIds | string[] | Selected teachers |
| teacherAvailabilities | TeacherAvailability[] | Per-teacher availability |
| teacherSubjectPreferences | TeacherSubjectPreference[] | Per-teacher subject prefs |
| status | 'draft' \| 'active' \| 'completed' | Lifecycle status |
| timetableId | string \| null | Generated timetable reference |

### 3.7 TimeSlot
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| day | string | Day of week |
| startHour | number | Start hour |
| endHour | number | End hour |
| subjectId | string | Subject being taught |
| teacherId | string | Teacher assigned |
| programmeIds | string[] | Programmes this slot serves |

### 3.8 Timetable
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| vacationClassId | string | Parent vacation class |
| slots | TimeSlot[] | All scheduled slots |
| generatedAt | string | ISO timestamp |

### 3.9 Student
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| name | string | Full name |
| email | string | Email address |
| programmeId | string | Joined programme |
| vacationClassId | string | Enrolled vacation class |

---

## 4. Page-by-Page Specifications

### 4.1 Auth / Login Page
- **Route**: `/login`
- **Access**: Public
- **Content**:
  - App branding with animated logo
  - Three demo login buttons (Admin, Teacher, Student) with role icons
  - Optional email/password fields (decorative for demo)
- **Actions**: Click demo button → set auth state → redirect to role dashboard

### 4.2 Admin Dashboard
- **Route**: `/admin`
- **Content**:
  - Stat cards: Total Subjects, Total Programmes, Total Teachers, Active Vacation Classes, Total Students
  - Recent activity feed
  - Quick action buttons (Create Subject, Create Programme, etc.)
  - Chart showing subject distribution (core vs elective)

### 4.3 Subjects Page
- **Route**: `/admin/subjects`
- **Content**:
  - Table/card grid of all subjects
  - Each subject shows: name, credit hours, type badge (core/elective)
  - Add Subject button → modal/slide-over form
  - Edit/Delete actions per subject
- **Form fields**: Name, Credit Hours (1-10), Type (core/elective toggle)
- **Validation**: Name required, credit hours 1-10

### 4.4 Programmes Page
- **Route**: `/admin/programmes`
- **Content**:
  - Card grid of all programmes
  - Each programme card shows: name, core subjects count, elective subjects list
  - Add Programme button → form
  - Edit/Delete actions
- **Form fields**: Name, Elective Subjects (multi-select from elective subjects pool)
- **Behavior**: Core subjects auto-included and displayed (non-removable)

### 4.5 Teachers Page
- **Route**: `/admin/teachers`
- **Content**:
  - Card grid of all teachers
  - Each teacher card shows: name, email, subject count, subject badges
  - Add Teacher button → form
  - Edit/Delete actions
- **Form fields**: Name, Email, Subjects (multi-select from all subjects)
- **Derived display**: Subject count shown on card

### 4.6 Vacation Classes Page
- **Route**: `/admin/vacation-classes`
- **Content**:
  - Card grid of vacation class periods
  - Each card shows: name, date range, programme count, teacher count, status badge
  - Create Vacation Class → multi-step form
- **Create Flow (Multi-Step)**:
  1. **Step 1 — Basics**: Name, Start Date, End Date
  2. **Step 2 — Programmes**: Select programmes to include → shows total subjects summary
  3. **Step 3 — Teachers**: Select teachers → for each teacher, set availability (days + hours) and subject preferences (pre-selected from their subjects)
  4. **Step 4 — Review**: Summary of all selections → Create button
- **After creation**: Status = 'draft', "Generate Timetable" button available

### 4.7 Timetable Page
- **Route**: `/admin/vacation-classes/:id/timetable`
- **Content**:
  - Weekly grid view (Days × Hours)
  - Color-coded slots by subject type (core/elective) and programme
  - Slot details: subject name, teacher name, programme(s)
  - "Generate Timetable" button (if not generated)
  - "Regenerate" button (if already generated)
- **Generation**: Runs scheduling algorithm, produces clash-free weekly schedule

### 4.8 Teacher Dashboard
- **Route**: `/teacher`
- **Content**:
  - Welcome card with teacher name
  - Today's classes list (if active vacation class)
  - Weekly schedule mini-view
  - Quick stats: subjects teaching, hours this week

### 4.9 Teacher Schedule Page
- **Route**: `/teacher/schedule`
- **Content**:
  - Full weekly timetable grid
  - Color-coded by subject
  - Slot details on hover/click

### 4.10 Teacher Availability Page
- **Route**: `/teacher/availability`
- **Content**:
  - Day-by-day availability editor
  - Toggle days on/off
  - Set start/end hours per day
  - Subject preference checkboxes (from their qualified subjects)
  - Save button

### 4.11 Student Dashboard
- **Route**: `/student`
- **Content**:
  - Welcome card
  - My Programme card (if enrolled)
  - Next class countdown
  - Weekly schedule mini-view

### 4.12 Student Timetable Page
- **Route**: `/student/timetable`
- **Content**:
  - Weekly grid showing student's personal schedule
  - Only shows slots relevant to their programme (core + their electives)
  - Slot details: subject, teacher, time

### 4.13 Student Join Programme Page
- **Route**: `/student/join`
- **Content**:
  - List of active vacation classes
  - For selected vacation class: available programmes with subject breakdown
  - Join button per programme
  - Already-joined indicator

---

## 5. Scheduling Algorithm

### Input
- Selected programmes with their subjects (core + elective)
- Selected teachers with availability and subject preferences
- Credit hours per subject (determines how many 1-hour slots needed per week)

### Constraints
1. **No core–core overlap**: All core subjects must be in distinct time slots
2. **No core–elective overlap**: Core subjects must not share time with any elective
3. **No same-programme elective overlap**: Electives within one programme must not overlap
4. **Teacher availability**: A teacher can only teach during their available hours
5. **Teacher subject match**: A teacher can only teach subjects they're assigned for that period
6. **Teacher uniqueness**: A teacher cannot teach two subjects simultaneously
7. **Credit hours**: Each subject must have exactly `creditHours` slots per week

### Algorithm Steps
1. **Collect all core subjects** → Schedule these first in non-overlapping slots
2. **Collect all elective subjects grouped by programme** → Schedule each group in non-overlapping slots, but electives from different programmes CAN share slots
3. **For each slot assignment**:
   a. Find available time slot (day + hour) that doesn't violate constraints
   b. Find an available teacher who teaches this subject and is free at this time
   c. Assign slot
4. **Repeat** until all credit hours are satisfied for all subjects
5. **If unsolvable**: Mark as "needs manual adjustment" with conflict report

### Slot Duration
- Default: 1 hour per slot
- A subject with 4 credit hours gets 4 separate 1-hour slots across the week

---

## 6. Preloaded Dummy Data

### Core Subjects
1. English Language (4 credit hours)
2. Mathematics (4 credit hours)
3. Integrated Science (3 credit hours)
4. Social Studies (3 credit hours)

### Elective Subjects
5. ICT (3 credit hours)
6. Biology (3 credit hours)
7. Geography (3 credit hours)
8. Government (3 credit hours)
9. Visual Art (4 credit hours)
10. Home Economics (3 credit hours)
11. Chemistry (3 credit hours)
12. Physics (3 credit hours)
13. Economics (3 credit hours)
14. Accounting (3 credit hours)

### Programmes
1. General Science with ICT → Electives: ICT, Chemistry, Physics
2. General Science with Biology → Electives: Biology, Chemistry, Physics
3. Business with Geography → Electives: Geography, Economics, Accounting
4. Business with Government → Electives: Government, Economics, Accounting
5. Visual Arts → Electives: Visual Art, ICT
6. Home Economics → Electives: Home Economics, Biology

### Teachers
1. Mr. Johnson — English, Social Studies
2. Mrs. Adama — Mathematics, ICT
3. Mr. Osei — Integrated Science, Biology, Chemistry
4. Mrs. Mensah — Geography, Government
5. Mr. Kufuor — Physics, Mathematics
6. Mrs. Asante — Visual Art, Home Economics
7. Mr. Tetteh — Economics, Accounting, Social Studies
8. Mrs. Dzokoto — English, Government

### Students
1. Kwame Asare — General Science with ICT
2. Abena Boateng — Business with Geography
3. Kofi Mensah — General Science with Biology
4. Ama Osei — Visual Arts
5. Yaa Tetteh — Home Economics
6. Kweku Darko — Business with Government

### Vacation Class (Pre-created)
- "Summer 2025 Vacation Class" — All 6 programmes, all 8 teachers, active status, timetable generated

---

## 7. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18+ with Vite |
| Styling | Tailwind CSS 3.4.x |
| State Management | Redux Toolkit |
| Routing | React Router DOM v6 |
| Animations | Framer Motion |
| Icons | Lucide React |
| IDs | nanoid |
| Backend Simulation | Redux store + dummy data (no server) |

---

## 8. File Structure

```
src/
├── app/
│   ├── store.ts                    # Redux store configuration
│   └── hooks.ts                    # Typed useSelector/useDispatch
├── types/
│   └── index.ts                    # All TypeScript interfaces/types
├── data/
│   └── dummyData.ts                # Preloaded dummy data
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx           # Main layout with sidebar
│   │   ├── Sidebar.tsx             # Role-based sidebar navigation
│   │   └── TopBar.tsx              # Top bar with theme toggle
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Toggle.tsx
│       ├── StatCard.tsx
│       ├── EmptyState.tsx
│       ├── PageHeader.tsx
│       └── AnimatedPage.tsx       # Page transition wrapper
├── features/
│   ├── auth/
│   │   ├── auth.slice.ts
│   │   ├── auth.hook.ts
│   │   └── Auth.tsx
│   ├── dashboard-admin/
│   │   ├── dashboardAdmin.slice.ts
│   │   ├── dashboardAdmin.hook.ts
│   │   └── DashboardAdmin.tsx
│   ├── subjects/
│   │   ├── subjects.slice.ts
│   │   ├── subjects.hook.ts
│   │   └── Subjects.tsx
│   ├── programmes/
│   │   ├── programmes.slice.ts
│   │   ├── programmes.hook.ts
│   │   └── Programmes.tsx
│   ├── teachers/
│   │   ├── teachers.slice.ts
│   │   ├── teachers.hook.ts
│   │   └── Teachers.tsx
│   ├── vacation-class/
│   │   ├── vacationClass.slice.ts
│   │   ├── vacationClass.hook.ts
│   │   └── VacationClass.tsx
│   ├── timetable/
│   │   ├── timetable.slice.ts
│   │   ├── timetable.hook.ts
│   │   ├── Timetable.tsx
│   │   └── scheduler.ts           # Scheduling algorithm
│   ├── dashboard-teacher/
│   │   ├── dashboardTeacher.hook.ts
│   │   └── DashboardTeacher.tsx
│   ├── teacher-schedule/
│   │   ├── teacherSchedule.hook.ts
│   │   └── TeacherSchedule.tsx
│   ├── teacher-availability/
│   │   ├── teacherAvailability.hook.ts
│   │   └── TeacherAvailability.tsx
│   ├── dashboard-student/
│   │   ├── dashboardStudent.hook.ts
│   │   └── DashboardStudent.tsx
│   ├── student-timetable/
│   │   ├── studentTimetable.hook.ts
│   │   └── StudentTimetable.tsx
│   └── student-join/
│       ├── studentJoin.hook.ts
│       └── StudentJoin.tsx
├── App.tsx                         # Router setup
├── main.tsx                        # Entry point
└── index.css                       # Tailwind directives + custom styles
```

---

## 9. UI/UX Design Principles

- **Theme**: Dark/light mode via Tailwind `dark:` prefix, persisted to localStorage
- **Animations**: Framer Motion for page transitions, card hover effects, modal entrances, list item stagger
- **Layout**: Sidebar navigation (collapsible), top bar with breadcrumbs + theme toggle
- **Cards**: Subtle shadows, rounded corners, hover lift effect
- **Typography**: Clean hierarchy, semibold headings, regular body
- **Colors**: Professional palette — indigo/slate for admin, emerald for teacher, violet for student
- **Spacing**: Consistent 4px grid (Tailwind defaults)
- **Empty States**: Illustrated empty states with call-to-action
- **Feedback**: Toast notifications for all CRUD operations
- **Responsive**: Works on desktop primarily (admin tool), responsive down to tablet

---

## 10. End-to-End Flows

### Flow 1: Admin Sets Up System
1. Admin logs in → sees empty dashboard
2. Creates core subjects (English, Math, Science, Social Studies)
3. Creates elective subjects (ICT, Biology, etc.)
4. Creates programmes by selecting elective subjects (core auto-added)
5. Creates teachers and assigns subjects
6. System is now configured and ready for vacation class creation

### Flow 2: Admin Creates Vacation Class & Generates Timetable
1. Admin clicks "Create Vacation Class"
2. Fills in name, dates → selects programmes → selects teachers
3. For each teacher: sets availability days/hours, confirms subject preferences
4. Reviews and creates → status = draft
5. Clicks "Generate Timetable" → algorithm runs → timetable displayed
6. Status changes to active
7. Students can now join

### Flow 3: Student Joins & Views Schedule
1. Student logs in → sees available vacation classes
2. Selects a vacation class → sees available programmes
3. Clicks "Join" on a programme → enrolled
4. Views personal timetable (filtered to their programme's subjects)

### Flow 4: Teacher Views Schedule & Sets Preferences
1. Teacher logs in → sees dashboard with schedule overview
2. Navigates to availability → adjusts days/hours
3. Adjusts which subjects they want to teach
4. Views full weekly schedule

---

## 11. Toast/Notification System

- Success: Green toast on create/update operations
- Error: Red toast on validation failures
- Info: Blue toast for informational updates
- All toasts auto-dismiss after 3 seconds with slide-out animation

---

## 12. Theme Configuration

### Light Mode
- Background: slate-50
- Surface: white
- Text: slate-900
- Border: slate-200

### Dark Mode
- Background: slate-950
- Surface: slate-900
- Text: slate-50
- Border: slate-700

### Accent Colors
- Admin: indigo-600 / indigo-400
- Teacher: emerald-600 / emerald-400
- Student: violet-600 / violet-400
