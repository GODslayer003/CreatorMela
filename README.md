# CreatorsMela - Admin Approvals & Moderation Dashboard

A production-grade internal moderation platform for reviewing creators, campaigns, and content before approval. Built with the MERN stack and designed to Fortune 500 quality standards.

## Architecture

```
creators-mela/
├── client/                    # React 19 + TypeScript + Vite
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── ui/           # Shadcn UI primitives
│       │   ├── layout/       # Sidebar, Topbar, ThemeProvider
│       │   └── common/       # CommandPalette, etc.
│       ├── features/         # Feature-based modules
│       │   ├── auth/         # Authentication
│       │   ├── dashboard/    # Dashboard widgets
│       │   ├── moderation/   # Queue, Review page
│       │   ├── activity-logs/
│       │   ├── notifications/
│       │   ├── profile/
│       │   └── settings/
│       ├── hooks/            # Custom React hooks
│       ├── layouts/          # Route layouts
│       ├── services/         # API layer (Axios)
│       ├── store/            # Redux Toolkit
│       ├── types/            # TypeScript interfaces
│       ├── utils/            # Utility functions
│       └── constants/        # Enums, labels, colors
└── server/                    # Node.js + Express + MongoDB
    ├── config/               # DB, environment
    ├── controllers/          # Request handlers
    ├── middlewares/           # Auth, error, validation
    ├── models/               # Mongoose schemas
    ├── routes/               # API routes
    ├── services/             # Business logic
    └── validators/           # Zod schemas
```

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing fast builds
- **TailwindCSS** + **Shadcn UI** for component system
- **Framer Motion** for animations
- **TanStack Query** for server state
- **Redux Toolkit** for client state
- **React Hook Form** + **Zod** for forms
- **Recharts** for data visualization
- **Lucide Icons**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** + **Refresh Tokens** (HTTP-only cookies)
- **Helmet**, **CORS**, **Rate Limiting**
- **bcrypt** for password hashing

## Installation

```bash
# Clone repository
git clone <repo-url>
cd creators-mela

# Install dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (ensure it's running)

# Seed database
cd server && node seed.js

# Start development
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection | mongodb://localhost:27017/creators-mela |
| `JWT_SECRET` | JWT signing key | (change in production) |
| `JWT_REFRESH_SECRET` | Refresh token key | (change in production) |
| `JWT_EXPIRES_IN` | Access token expiry | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | 7d |
| `CORS_ORIGIN` | Allowed origin | http://localhost:5173 |

## API Documentation

### Base URL: `/api/v1`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard statistics |

### Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/submissions` | List submissions |
| GET | `/submissions/:id` | Get submission |
| POST | `/submissions/:id/approve` | Approve |
| POST | `/submissions/:id/reject` | Reject |
| POST | `/submissions/:id/request-changes` | Request changes |
| POST | `/submissions/:id/assign` | Assign reviewer |
| POST | `/submissions/bulk` | Bulk actions |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | List reviews |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments` | List comments |
| POST | `/comments` | Create comment |

### Activity Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activity-logs` | List activity logs |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all as read |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users |
| GET | `/users/:id` | Get user |

## Authentication Flow

1. User submits credentials via `/auth/login`
2. Server validates credentials, generates JWT access + refresh tokens
3. Tokens stored as HTTP-only cookies (secure, SameSite=strict)
4. Access token expires in 15 minutes
5. Refresh token used to obtain new access token
6. Automatic token refresh on 401 responses

## Security Features

- **Helmet** - Security headers
- **CORS** - Origin whitelist
- **Rate Limiting** - 100 requests per 15 minutes
- **Mongo Sanitization** - NoSQL injection prevention
- **JWT** - Short-lived access tokens
- **HTTP-only Cookies** - XSS protection
- **RBAC** - Role-based access control
- **Input Validation** - Zod schemas
- **Audit Logs** - Complete action trail
- **bcrypt** - Password hashing (12 rounds)

## Performance Optimizations

- **Code Splitting** - Lazy loaded routes
- **React Query Cache** - Server state caching
- **Memoization** - useMemo, useCallback, React.memo
- **Virtualized Rendering** - For large lists
- **MongoDB Indexes** - Optimized queries
- **Debounced Search** - Reduced API calls
- **Optimistic Updates** - Instant UI feedback

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open command palette |
| `/` | Focus search |
| `[` | Toggle sidebar |
| `A` | Approve (in review) |
| `R` | Reject (in review) |
| `C` | Request changes (in review) |
| `Esc` | Close dialog |

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@creatorsmela.com | admin123 |
| Moderator | alex@creatorsmela.com | mod123 |

## Database Collections

- **Admins** - User accounts with roles
- **Creators** - Creator profiles
- **Campaigns** - Brand campaigns
- **Submissions** - Items for review
- **Reviews** - Moderation decisions
- **Comments** - Discussion threads
- **ActivityLogs** - Audit trail
- **Notifications** - User alerts
- **AuditLogs** - Security logs

All collections include `createdAt`, `updatedAt`, `deletedAt` (soft delete).

## License

MIT
