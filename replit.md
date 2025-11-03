# Employee Task Scheduler

## Overview

The Employee Task Scheduler is a productivity application designed to manage weekly task assignments for a team of four employees (Tyler, Nalleli, Claudia, and Ana). The system automates the scheduling of two primary recurring tasks:

1. **Foreign Currency Audits** - Performed by pairs of employees on a specific weekday (Monday-Friday)
2. **Branch Balance Checks** - Performed by a single employee (excluding Nalleli)

The application ensures fair distribution of tasks by intelligently rotating employee pairs and audit days week-to-week, while maintaining a complete history of past assignments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI System**: 
- Component library based on shadcn/ui (Radix UI primitives)
- Styling via Tailwind CSS with custom design tokens
- Design philosophy emphasizes utility-first productivity (inspired by Linear and Google Calendar)
- Three theme modes supported: light, soft, and dark
- Typography system using Inter for UI elements and JetBrains Mono for date/time displays

**Routing**: Client-side routing via wouter library with four main pages:
- Dashboard (current and next week overview)
- Schedule (week navigation and viewing)
- History (searchable table of past assignments)
- Settings (email notifications and theme preferences)

**State Management**:
- TanStack Query (React Query) for server state and caching
- React hooks for local component state
- No global state management library (query cache serves this purpose)

**Key Design Decisions**:
- Single-page application with client-side routing for fast navigation
- Optimistic UI updates with automatic cache invalidation
- Responsive layout with collapsible sidebar (mobile-first approach)
- Custom spacing system using Tailwind units (2, 4, 6, 8, 12, 16)

### Backend Architecture

**Framework**: Express.js server with TypeScript

**API Design**: RESTful endpoints structured as:
- `GET /api/assignments` - Retrieve all assignments
- `GET /api/assignments/:id` - Get specific assignment
- `GET /api/assignments/week/:date` - Get assignment for specific week
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update existing assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/generate-next` - Generate next week's schedule

**Scheduling Algorithm**:
- Deterministic randomization to ensure variety while avoiding consecutive repeats
- Previous week's pair and day are excluded from next week's options
- Balance check employee is randomly selected from eligible employees (Tyler, Claudia, Ana)
- Week start is always Monday (ISO week standard)

**Key Design Decisions**:
- Middleware for request logging and JSON parsing
- Error handling with structured error responses
- Environment-based configuration (development vs production)

### Data Storage

**Database**: PostgreSQL via Neon serverless

**ORM**: Drizzle ORM with Zod schema validation

**Schema Design**:

**Users Table**:
- id (UUID, primary key)
- username (text, unique)
- password (text, hashed)

**Assignments Table**:
- id (UUID, primary key)
- weekStartDate (timestamp, indexed for queries)
- auditEmployee1 (text)
- auditEmployee2 (text)
- auditDay (integer, 1-5 representing Mon-Fri)
- balanceCheckEmployee (text)
- notes (text, optional)
- createdAt (timestamp)

**Key Design Decisions**:
- Week start date used as natural business key for querying
- Employee names stored as text literals (enum type in TypeScript)
- Audit day stored as integer for simpler comparison logic
- Optional notes field for manual override explanations
- Separate storage layer abstraction (IStorage interface) allowing future database swapping

### External Dependencies

**Email Service** (Placeholder Implementation):
- Currently configured but not implemented
- Designed to support Resend, SendGrid, or Outlook integration
- Environment variables prepared for future email API keys
- HTML email templates pre-built for assignment notifications
- Notification logic includes employee-specific emails for audit partners and balance check assignments

**Third-Party Libraries**:
- **Radix UI**: Accessible, unstyled component primitives (dialogs, dropdowns, tooltips, etc.)
- **TanStack Query**: Server state synchronization and caching
- **date-fns**: Date manipulation and formatting
- **Drizzle ORM**: Type-safe database queries
- **Zod**: Runtime schema validation
- **Tailwind CSS**: Utility-first styling
- **Wouter**: Lightweight client-side routing

**Development Tools**:
- Vite with React plugin for fast HMR
- TypeScript for type safety
- ESBuild for production bundling
- Replit-specific plugins for development environment integration

**Key Design Decisions**:
- Email service abstracted to allow easy swapping of providers
- All UI components built on accessible primitives from Radix
- Date handling standardized through date-fns to avoid timezone issues
- Validation schemas shared between client and server via shared directory
- WebSocket support for Neon database through ws library