# WriteSpace

A modern, privacy-first blogging platform built with Angular 18+. Write, share, and manage your content — all stored locally in your browser with zero server dependencies.

## Features

### Public Landing Page
- Hero section with gradient background and call-to-action buttons
- Feature highlights showcasing privacy-first design, role-based access, and instant performance
- Latest posts preview section with dynamic content from localStorage
- Responsive footer with navigation links and branding

### Authentication System
- Login page with form validation and error handling
- Registration page with display name, username, password, and confirm password fields
- Password match validation across registration form
- Hard-coded admin account for initial platform access
- Session persistence via localStorage
- Route guards for authenticated, guest, and admin-only routes

### Role-Based Access Control
- **Admin** — Can manage all posts and users across the platform
- **Viewer** — Can create, read, edit, and delete their own posts
- Guest guard redirects authenticated users away from login and registration pages
- Auth guard redirects unauthenticated users to the login page
- Admin guard restricts dashboard and user management to admin users only

### Blog CRUD Operations
- Blog list page displaying all posts in a responsive card grid
- Write blog page with title (100 character limit) and content (5000 character limit) fields
- Character count indicators for title and content fields
- Edit blog functionality with pre-populated form fields
- Delete blog functionality with confirmation modal
- Read blog page with full post content, author info, and action buttons
- Posts sorted by creation date in descending order

### Admin Dashboard
- Statistics overview with total posts, total users, admin count, and viewer count
- Stat cards with emoji icons and color-coded top borders
- Quick action buttons for writing new posts and managing users
- Recent posts table with title, author, date, and action columns
- Inline edit and delete actions for all posts

### User Management
- Create new user form with display name, username, password, confirm password, and role fields
- Form validation with inline error messages
- Success and error banners for user creation feedback
- Users table displaying all users with avatar, username, role badge, and creation date
- Delete user functionality with confirmation modal
- Protection against deleting the hard-coded admin account or the currently logged-in user

### Avatar System
- Emoji-based avatars with role-specific icons (👑 for admin, 📖 for viewer)
- Role-specific background colors (purple for admin, indigo for viewer)
- Three size variants: small, medium, and large

### Design System
- Comprehensive CSS custom properties for colors, typography, spacing, shadows, and transitions
- Gradient utilities for hero sections, buttons, and card backgrounds
- Responsive grid system with mobile-first breakpoints at 640px, 768px, 1024px, and 1280px
- Card, button, form, badge, and avatar component styles
- Skeleton loading animation utilities
- Fade-in, slide-in, and scale-in CSS animations

## Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 18+** | Frontend framework with standalone components |
| **TypeScript 5.5** | Type-safe development |
| **RxJS 7.8** | Reactive programming utilities |
| **localStorage** | Client-side data persistence |
| **CSS Custom Properties** | Design system and theming |
| **Vercel** | Deployment platform with SPA rewrite rules |

## Folder Structure

```
src/
├── app/
│   ├── components/
│   │   ├── avatar/              # Emoji-based avatar component
│   │   ├── navbar/              # Responsive navigation bar
│   │   ├── post-card/           # Blog post card with excerpt
│   │   └── stat-card/           # Dashboard statistic card
│   ├── guards/
│   │   ├── admin.guard.ts       # Admin-only route protection
│   │   ├── auth.guard.ts        # Authenticated route protection
│   │   └── guest.guard.ts       # Guest-only route protection
│   ├── models/
│   │   ├── post.model.ts        # Post and PostInput interfaces
│   │   └── user.model.ts        # User, Session, UserRole types
│   ├── pages/
│   │   ├── admin-dashboard/     # Admin statistics and recent posts
│   │   ├── blog-list/           # All blog posts grid
│   │   ├── home/                # Public landing page
│   │   ├── login/               # Login form
│   │   ├── read-blog/           # Full blog post view
│   │   ├── register/            # Registration form
│   │   ├── user-management/     # User CRUD for admins
│   │   └── write-blog/          # Create and edit blog posts
│   ├── pipes/
│   │   └── excerpt.pipe.ts      # Content truncation pipe
│   ├── services/
│   │   ├── auth.service.ts      # Authentication and registration
│   │   ├── avatar.service.ts    # Role-based avatar configuration
│   │   ├── blog.service.ts      # Blog CRUD operations
│   │   ├── storage.service.ts   # localStorage abstraction layer
│   │   └── user.service.ts      # User management operations
│   ├── app.component.ts         # Root component
│   ├── app.config.ts            # Application configuration
│   └── app.routes.ts            # Route definitions
├── environments/
│   ├── environment.ts           # Development environment
│   └── environment.prod.ts      # Production environment
├── index.html                   # HTML entry point
├── main.ts                      # Application bootstrap
└── styles.css                   # Global design system
```

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 18.x (`npm install -g @angular/cli`)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace-blog

# Install dependencies
npm install
```

### Development Server

```bash
# Start the development server
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

### Build

```bash
# Production build
ng build

# Development build with watch mode
ng build --watch --configuration development
```

Build artifacts are stored in the `dist/writespace-blog` directory.

### Running Tests

```bash
ng test
```

## Route Map

| Path | Component | Guard | Description |
|---|---|---|---|
| `/` | HomeComponent | — | Public landing page |
| `/login` | LoginComponent | Guest | Login form |
| `/register` | RegisterComponent | Guest | Registration form |
| `/blogs` | BlogListComponent | Auth | All blog posts |
| `/blogs/write` | WriteBlogComponent | Auth | Create a new post |
| `/blogs/edit/:id` | WriteBlogComponent | Auth | Edit an existing post |
| `/blogs/:id` | ReadBlogComponent | Auth | Read a single post |
| `/admin/dashboard` | AdminDashboardComponent | Admin | Admin statistics overview |
| `/admin/users` | UserManagementComponent | Admin | User management panel |

## Default Admin Account

The platform ships with a hard-coded admin account for initial access:

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin123` |

This account cannot be deleted through the user management interface.

## localStorage Schema

All data is persisted in the browser's `localStorage` using the following keys:

### `posts` — `Post[]`

```typescript
interface Post {
  id: string;          // UUID v4
  title: string;       // Max 100 characters
  content: string;     // Max 5000 characters
  createdAt: string;   // ISO 8601 timestamp
  authorId: string;    // User ID reference
  authorName: string;  // Display name at time of creation
}
```

### `users` — `User[]`

```typescript
interface User {
  id: string;          // UUID v4
  display_name: string;
  username: string;
  password: string;    // Plain text (local-only storage)
  role: 'admin' | 'viewer';
  created_at: string;  // ISO 8601 timestamp
}
```

### `currentUser` — `Session`

```typescript
interface Session {
  user_id: string;
  username: string;
  display_name: string;
  role: 'admin' | 'viewer';
}
```

> **Note:** All data is stored locally in the browser. Clearing browser data or localStorage will remove all posts, users, and session information. Passwords are stored in plain text since there is no server — this is by design for a client-only demo application.

## Deployment

### Vercel

The project includes a `vercel.json` configuration file with SPA rewrite rules for client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy:

1. Push the repository to GitHub, GitLab, or Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will auto-detect the Angular framework and configure the build
4. The build command defaults to `ng build` and the output directory to `dist/writespace-blog/browser`

### Manual Deployment

```bash
# Build for production
ng build --configuration production

# Serve the dist/writespace-blog/browser directory with any static file server
# Ensure all routes fall back to index.html for client-side routing
```

## License

This project is proprietary and private. All rights reserved.