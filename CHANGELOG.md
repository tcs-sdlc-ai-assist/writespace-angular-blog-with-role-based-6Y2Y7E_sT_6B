# Changelog

All notable changes to the **WriteSpace** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-01

### Added

- **Public Landing Page**
  - Hero section with gradient background and call-to-action buttons
  - Feature highlights showcasing privacy-first design, role-based access, and instant performance
  - Latest posts preview section with dynamic content from localStorage
  - Responsive footer with navigation links and branding

- **Authentication System**
  - Login page with form validation and error handling
  - Registration page with display name, username, password, and confirm password fields
  - Password match validation across registration form
  - Hard-coded admin account (`admin` / `admin123`) for initial platform access
  - Session persistence via localStorage
  - Route guards for authenticated, guest, and admin-only routes

- **Role-Based Access Control**
  - Two user roles: `admin` and `viewer`
  - Admin users can manage all posts and users across the platform
  - Viewer users can create, read, edit, and delete their own posts
  - Guest guard redirects authenticated users away from login and registration pages
  - Auth guard redirects unauthenticated users to the login page
  - Admin guard restricts dashboard and user management to admin users only

- **Blog CRUD Operations**
  - Blog list page displaying all posts in a responsive card grid
  - Write blog page with title (100 character limit) and content (5000 character limit) fields
  - Character count indicators for title and content fields
  - Edit blog functionality with pre-populated form fields
  - Delete blog functionality with confirmation modal
  - Read blog page with full post content, author info, and action buttons
  - Posts sorted by creation date in descending order

- **Admin Dashboard**
  - Statistics overview with total posts, total users, admin count, and viewer count
  - Stat cards with emoji icons and color-coded top borders
  - Quick action buttons for writing new posts and managing users
  - Recent posts table with title, author, date, and action columns
  - Inline edit and delete actions for all posts
  - Delete confirmation modal with error handling

- **User Management**
  - Create new user form with display name, username, password, confirm password, and role fields
  - Form validation with inline error messages
  - Success and error banners for user creation feedback
  - Users table displaying all users with avatar, username, role badge, and creation date
  - Delete user functionality with confirmation modal
  - Protection against deleting the hard-coded admin account or the currently logged-in user

- **Avatar System**
  - Emoji-based avatars with role-specific icons (👑 for admin, 📖 for viewer)
  - Role-specific background colors (purple for admin, indigo for viewer)
  - Three size variants: small, medium, and large
  - Accessible ARIA labels with display name and role information

- **Reusable Components**
  - `NavbarComponent` with responsive mobile menu, user info display, and role-based navigation links
  - `PostCardComponent` with author avatar, formatted date, title, content excerpt, and edit action
  - `StatCardComponent` with configurable title, value, icon, and accent color
  - `AvatarComponent` with role-based emoji and color configuration
  - `ExcerptPipe` for truncating post content with ellipsis

- **Data Persistence**
  - All data stored in browser localStorage (posts, users, current session)
  - `StorageService` providing typed get/set/remove operations with JSON serialization
  - Graceful error handling for storage unavailability or quota limits

- **Design System**
  - Comprehensive CSS custom properties for colors, typography, spacing, shadows, and transitions
  - Gradient utilities for hero sections, buttons, and card backgrounds
  - Responsive grid system with mobile-first breakpoints at 640px, 768px, 1024px, and 1280px
  - Card, button, form, badge, and avatar component styles
  - Skeleton loading animation utilities
  - Custom scrollbar styling
  - Fade-in, slide-in, and scale-in CSS animations

- **Deployment**
  - Vercel configuration with SPA rewrite rules for client-side routing
  - Production and development build configurations via Angular CLI
  - Path aliases (`@app/*`, `@environments/*`) for clean import statements