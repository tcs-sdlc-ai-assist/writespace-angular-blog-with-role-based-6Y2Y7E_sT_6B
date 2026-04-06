# Deployment Guide

This document covers everything you need to deploy **WriteSpace** to production using Vercel as a static SPA host.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Build](#project-build)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deployment from Git](#automatic-deployment-from-git)
  - [Manual Deployment via Vercel CLI](#manual-deployment-via-vercel-cli)
- [Vercel Configuration](#vercel-configuration)
- [SPA Routing](#spa-routing)
- [Environment Setup](#environment-setup)
- [Build Output](#build-output)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have the following installed locally:

| Tool | Version | Purpose |
|---|---|---|
| **Node.js** | 18.x or higher | JavaScript runtime |
| **npm** | 9.x or higher | Package manager |
| **Angular CLI** | 18.x | Build tooling (`npm install -g @angular/cli`) |
| **Vercel CLI** (optional) | Latest | Manual deployments (`npm install -g vercel`) |

---

## Project Build

### Production Build

```bash
# Install dependencies
npm install

# Build for production
ng build --configuration production
```

This generates optimized, minified, and hashed output files in the `dist/writespace-blog/browser` directory.

### Development Build

```bash
# Build with source maps and no optimization (for debugging)
ng build --configuration development
```

### Watch Mode

```bash
# Rebuild automatically on file changes
ng build --watch --configuration development
```

### Verify the Build Locally

You can serve the production build locally using any static file server:

```bash
# Using npx and a simple HTTP server
npx serve dist/writespace-blog/browser
```

Navigate to `http://localhost:3000` to verify the build works correctly before deploying.

---

## Vercel Deployment

### Automatic Deployment from Git

This is the **recommended** approach. Vercel watches your Git repository and automatically builds and deploys on every push.

1. **Push your code** to a Git provider (GitHub, GitLab, or Bitbucket).

2. **Import the project in Vercel:**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Select your Git repository
   - Vercel will auto-detect the Angular framework

3. **Configure the build settings** (Vercel typically auto-detects these, but verify):

   | Setting | Value |
   |---|---|
   | **Framework Preset** | Angular |
   | **Build Command** | `ng build --configuration production` |
   | **Output Directory** | `dist/writespace-blog/browser` |
   | **Install Command** | `npm install` |
   | **Node.js Version** | 18.x |

4. **Click Deploy.** Vercel will install dependencies, run the build, and publish the site.

5. **Subsequent deployments** happen automatically:
   - Every push to the **main** branch triggers a **production** deployment
   - Every push to other branches or pull requests triggers a **preview** deployment

### Manual Deployment via Vercel CLI

If you prefer to deploy from your local machine without connecting a Git repository:

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod
```

On the first run, the CLI will prompt you to configure the project. Use these settings:

```
? Set up and deploy? Yes
? Which scope? <your-vercel-account>
? Link to existing project? No
? What's your project's name? writespace-blog
? In which directory is your code located? ./
? Want to modify these settings? Yes
? Build Command: ng build --configuration production
? Output Directory: dist/writespace-blog/browser
? Development Command: ng serve
```

---

## Vercel Configuration

The project includes a `vercel.json` file at the repository root that configures SPA routing:

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

This file is automatically picked up by Vercel during deployment. No additional configuration is required.

### What This Configuration Does

- **Rewrites all routes** to `index.html` so that Angular's client-side router handles navigation
- Ensures that deep links (e.g., `https://your-app.vercel.app/blogs/write`) work correctly when accessed directly or refreshed
- Static assets (JS, CSS, images) are still served normally because Vercel serves existing files before applying rewrites

---

## SPA Routing

WriteSpace is a single-page application (SPA). All routing is handled client-side by Angular Router. This means:

1. **The server must return `index.html` for all routes** that don't match a static file.
2. Angular Router then reads the URL and renders the appropriate component.

### Route Map

| Path | Component | Guard |
|---|---|---|
| `/` | HomeComponent | — |
| `/login` | LoginComponent | Guest |
| `/register` | RegisterComponent | Guest |
| `/blogs` | BlogListComponent | Auth |
| `/blogs/write` | WriteBlogComponent | Auth |
| `/blogs/edit/:id` | WriteBlogComponent | Auth |
| `/blogs/:id` | ReadBlogComponent | Auth |
| `/admin/dashboard` | AdminDashboardComponent | Admin |
| `/admin/users` | UserManagementComponent | Admin |
| `**` | Redirects to `/` | — |

### Non-Vercel Hosting

If you deploy to a different static hosting provider, ensure the server is configured to fall back to `index.html` for all routes. Examples:

**Nginx:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/writespace-blog/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (.htaccess):**

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Netlify (_redirects):**

```
/*    /index.html   200
```

---

## Environment Setup

WriteSpace uses Angular's environment files for configuration:

| File | Purpose |
|---|---|
| `src/environments/environment.ts` | Development configuration |
| `src/environments/environment.prod.ts` | Production configuration |

### Current Environment Variables

```typescript
// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.writespace.com/api',
};
```

> **Note:** WriteSpace currently stores all data in the browser's `localStorage`. The `apiUrl` values are included for future extensibility but are not actively used. No server-side API is required for deployment.

### Angular Build Configurations

The `angular.json` file defines two build configurations:

- **`production`** — Enables optimization, output hashing, and budget enforcement
- **`development`** — Disables optimization, enables source maps for debugging

The production configuration is used by default when running `ng build`:

```bash
# Uses production configuration (default)
ng build

# Explicitly specify production
ng build --configuration production

# Use development configuration
ng build --configuration development
```

---

## Build Output

After running `ng build --configuration production`, the output is located at:

```
dist/
└── writespace-blog/
    └── browser/
        ├── index.html
        ├── main-[hash].js
        ├── polyfills-[hash].js
        ├── styles-[hash].css
        └── ...
```

### Production Build Budgets

The Angular build enforces the following size budgets (defined in `angular.json`):

| Budget Type | Warning Threshold | Error Threshold |
|---|---|---|
| **Initial bundle** | 500 kB | 1 MB |
| **Any component style** | 2 kB | 4 kB |

If the build exceeds these thresholds, you will see warnings or errors during the build process.

---

## CI/CD Notes

### Automatic Deployments with Vercel + Git

When your repository is connected to Vercel:

- **Production deployments** are triggered on every push to the `main` branch (or your configured production branch)
- **Preview deployments** are triggered on every push to any other branch or on pull request creation
- Each preview deployment gets a unique URL for testing before merging

### GitHub Actions (Optional)

If you want to run tests or linting before Vercel deploys, you can add a GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: ng test --watch=false --browsers=ChromeHeadless

      - name: Build
        run: ng build --configuration production
```

Vercel will still handle the actual deployment. This workflow ensures code quality before the deploy proceeds.

### Branch Protection (Recommended)

For team workflows, configure branch protection rules on your `main` branch:

1. Require pull request reviews before merging
2. Require status checks to pass (CI workflow above)
3. Require branches to be up to date before merging

This ensures that only tested and reviewed code reaches production.

---

## Troubleshooting

### Common Issues

**1. Routes return 404 on page refresh**

- **Cause:** The hosting provider is not configured to fall back to `index.html` for client-side routes.
- **Fix:** Ensure `vercel.json` is present at the repository root with the rewrite rule. For non-Vercel hosts, configure the equivalent fallback (see [Non-Vercel Hosting](#non-vercel-hosting)).

**2. Build fails with budget exceeded error**

- **Cause:** The production bundle exceeds the configured size limits in `angular.json`.
- **Fix:** Review recent changes for large dependencies or unoptimized assets. Adjust the budget thresholds in `angular.json` if the increase is intentional.

**3. Blank page after deployment**

- **Cause:** The `<base href="/">` in `index.html` may not match the deployment path, or the output directory is misconfigured.
- **Fix:** Verify the output directory is set to `dist/writespace-blog/browser` in Vercel settings. Ensure `index.html` contains `<base href="/">`.

**4. Vercel auto-detection picks wrong framework**

- **Cause:** Vercel may misidentify the project framework.
- **Fix:** Manually set the framework preset to **Angular** in the Vercel project settings, and confirm the build command is `ng build --configuration production` with output directory `dist/writespace-blog/browser`.

**5. localStorage data is lost between deployments**

- **Cause:** This is expected behavior. `localStorage` is scoped to the browser and domain. Deployments do not affect client-side storage.
- **Note:** Users will retain their data as long as they access the same domain and do not clear their browser data.

**6. Old cached assets served after deployment**

- **Cause:** Browser caching of previous build assets.
- **Fix:** The production build uses output hashing (`outputHashing: "all"` in `angular.json`), which generates unique filenames for each build. Hard-refreshing the browser (`Ctrl+Shift+R` or `Cmd+Shift+R`) will load the latest assets.

---

## Quick Reference

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --configuration production

# Deploy to Vercel (preview)
vercel

# Deploy to Vercel (production)
vercel --prod

# Run tests
ng test
```