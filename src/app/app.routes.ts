import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';
import { guestGuard } from '@app/guards/guest.guard';
import { adminGuard } from '@app/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@app/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('@app/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('@app/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'blogs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/blog-list/blog-list.component').then((m) => m.BlogListComponent),
  },
  {
    path: 'blogs/write',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/write-blog/write-blog.component').then((m) => m.WriteBlogComponent),
  },
  {
    path: 'blogs/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/write-blog/write-blog.component').then((m) => m.WriteBlogComponent),
  },
  {
    path: 'blogs/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/read-blog/read-blog.component').then((m) => m.ReadBlogComponent),
  },
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('@app/pages/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('@app/pages/user-management/user-management.component').then((m) => m.UserManagementComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];