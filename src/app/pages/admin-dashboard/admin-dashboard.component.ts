import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { BlogService } from '@app/services/blog.service';
import { UserService } from '@app/services/user.service';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { StatCardComponent } from '@app/components/stat-card/stat-card.component';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import type { Session } from '@app/models/user.model';
import type { User } from '@app/models/user.model';
import type { Post } from '@app/models/post.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, StatCardComponent, AvatarComponent],
  template: `
    <div class="admin-dashboard-page">
      <app-navbar></app-navbar>
      <div class="admin-dashboard-content">
        <div class="container">
          <!-- Banner Header -->
          <div class="dashboard-banner gradient-hero">
            <div class="dashboard-banner-content">
              <h1 class="dashboard-banner-title">📊 Admin Dashboard</h1>
              <p class="dashboard-banner-subtitle">
                Welcome back, {{ currentUser?.display_name }}! Here's an overview of your WriteSpace platform.
              </p>
            </div>
          </div>

          <!-- Stat Cards -->
          <div class="dashboard-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <app-stat-card
              title="Total Posts"
              [value]="totalPosts"
              icon="📝"
              color="var(--color-indigo-600)"
            ></app-stat-card>
            <app-stat-card
              title="Total Users"
              [value]="totalUsers"
              icon="👥"
              color="var(--color-violet-600)"
            ></app-stat-card>
            <app-stat-card
              title="Admins"
              [value]="adminCount"
              icon="👑"
              color="var(--color-pink-500)"
            ></app-stat-card>
            <app-stat-card
              title="Viewers"
              [value]="viewerCount"
              icon="📖"
              color="var(--color-teal-500)"
            ></app-stat-card>
          </div>

          <!-- Quick Actions -->
          <div class="dashboard-actions">
            <h2 class="dashboard-section-title">Quick Actions</h2>
            <div class="dashboard-actions-grid">
              <a routerLink="/blogs/write" class="btn btn-primary btn-lg">
                ✏️ Write New Post
              </a>
              <a routerLink="/admin/users" class="btn btn-outline btn-lg">
                👥 Manage Users
              </a>
            </div>
          </div>

          <!-- Recent Posts Table -->
          <div class="dashboard-recent">
            <h2 class="dashboard-section-title">Recent Posts</h2>
            <ng-container *ngIf="recentPosts.length > 0; else emptyPosts">
              <div class="dashboard-table-card card">
                <div class="dashboard-table-wrapper">
                  <table class="dashboard-table">
                    <thead>
                      <tr>
                        <th class="table-th">Title</th>
                        <th class="table-th">Author</th>
                        <th class="table-th">Date</th>
                        <th class="table-th table-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let post of recentPosts" class="table-row">
                        <td class="table-td">
                          <span class="table-post-title">{{ post.title }}</span>
                        </td>
                        <td class="table-td">
                          <div class="table-author">
                            <app-avatar
                              [role]="post.authorId === 'admin-001' ? 'admin' : 'viewer'"
                              [displayName]="post.authorName"
                              size="sm"
                            ></app-avatar>
                            <span class="table-author-name">{{ post.authorName }}</span>
                          </div>
                        </td>
                        <td class="table-td">
                          <span class="table-date">{{ formatDate(post.createdAt) }}</span>
                        </td>
                        <td class="table-td table-td-actions">
                          <button
                            class="btn btn-sm btn-outline-secondary"
                            (click)="onEditPost(post.id)"
                            aria-label="Edit post"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            class="btn btn-sm btn-outline-secondary table-delete-btn"
                            (click)="onDeletePost(post.id)"
                            aria-label="Delete post"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ng-container>
            <ng-template #emptyPosts>
              <div class="empty-state card">
                <div class="card-body empty-state-body text-center">
                  <span class="empty-state-icon">📝</span>
                  <h3 class="empty-state-title">No posts yet</h3>
                  <p class="empty-state-text">
                    Start creating content for your WriteSpace platform.
                  </p>
                  <a routerLink="/blogs/write" class="btn btn-primary">
                    Write Your First Post
                  </a>
                </div>
              </div>
            </ng-template>
          </div>

          <!-- Delete Confirmation Modal -->
          <div
            *ngIf="showDeleteConfirm"
            class="delete-overlay"
            (click)="cancelDelete()"
          >
            <div class="delete-dialog card" (click)="$event.stopPropagation()">
              <div class="card-body delete-dialog-body">
                <span class="delete-dialog-icon">⚠️</span>
                <h3 class="delete-dialog-title">Delete Post</h3>
                <p class="delete-dialog-text">
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
                <div
                  *ngIf="errorMessage"
                  class="delete-error"
                  role="alert"
                >
                  <span>{{ errorMessage }}</span>
                </div>
                <div class="delete-dialog-actions">
                  <button
                    class="btn btn-outline-secondary"
                    (click)="cancelDelete()"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn btn-primary delete-confirm-btn"
                    (click)="confirmDelete()"
                    [disabled]="isDeleting"
                  >
                    {{ isDeleting ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .admin-dashboard-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
    }

    .admin-dashboard-content {
      padding: var(--spacing-8) 0;
    }

    /* Banner */
    .dashboard-banner {
      border-radius: var(--radius-xl);
      padding: var(--spacing-10) var(--spacing-8);
      margin-bottom: var(--spacing-8);
      color: var(--color-text-inverse);
    }

    .dashboard-banner-content {
      max-width: 600px;
    }

    .dashboard-banner-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-inverse);
      margin-bottom: var(--spacing-3);
    }

    .dashboard-banner-subtitle {
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 0;
      line-height: var(--line-height-relaxed);
    }

    /* Stats */
    .dashboard-stats {
      margin-bottom: var(--spacing-8);
      gap: var(--spacing-6);
    }

    /* Actions */
    .dashboard-actions {
      margin-bottom: var(--spacing-8);
    }

    .dashboard-section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-4);
    }

    .dashboard-actions-grid {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    /* Recent Posts Table */
    .dashboard-recent {
      margin-bottom: var(--spacing-8);
    }

    .dashboard-table-card {
      border: none;
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .dashboard-table-wrapper {
      overflow-x: auto;
    }

    .dashboard-table {
      width: 100%;
      border-collapse: collapse;
    }

    .table-th {
      padding: var(--spacing-3) var(--spacing-4);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      text-align: left;
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wide);
      background-color: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border);
    }

    .table-th-actions {
      text-align: right;
    }

    .table-row {
      transition: background-color var(--transition-fast);
    }

    .table-row:hover {
      background-color: var(--color-bg-secondary);
    }

    .table-td {
      padding: var(--spacing-4);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
    }

    .table-td-actions {
      text-align: right;
      white-space: nowrap;
    }

    .table-td-actions .btn {
      margin-left: var(--spacing-2);
    }

    .table-post-title {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .table-author {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .table-author-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      white-space: nowrap;
    }

    .table-date {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    .table-delete-btn {
      color: var(--color-error);
      border-color: var(--color-error);
    }

    .table-delete-btn:hover {
      background-color: var(--color-error-light);
      color: var(--color-error);
      border-color: var(--color-error);
    }

    /* Empty State */
    .empty-state {
      max-width: 480px;
      margin: 0 auto;
    }

    .empty-state-body {
      padding: var(--spacing-10);
    }

    .empty-state-icon {
      font-size: var(--font-size-5xl);
      display: block;
      margin-bottom: var(--spacing-4);
      line-height: 1;
    }

    .empty-state-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .empty-state-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-6);
    }

    /* Delete Modal */
    .delete-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal, 400);
      padding: var(--spacing-4);
    }

    .delete-dialog {
      width: 100%;
      max-width: 420px;
      border: none;
      box-shadow: var(--shadow-xl);
    }

    .delete-dialog-body {
      padding: var(--spacing-8);
      text-align: center;
    }

    .delete-dialog-icon {
      font-size: var(--font-size-5xl);
      display: block;
      margin-bottom: var(--spacing-4);
      line-height: 1;
    }

    .delete-dialog-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .delete-dialog-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-6);
    }

    .delete-error {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--color-error-light);
      color: var(--color-error);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-6);
    }

    .delete-dialog-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-3);
    }

    .delete-confirm-btn {
      background-color: var(--color-error);
      border-color: var(--color-error);
    }

    .delete-confirm-btn:hover {
      background-color: #dc2626;
      border-color: #dc2626;
    }

    @media (min-width: 768px) {
      .admin-dashboard-content {
        padding: var(--spacing-12) 0;
      }

      .dashboard-banner {
        padding: var(--spacing-12) var(--spacing-10);
      }

      .dashboard-banner-title {
        font-size: var(--font-size-4xl);
      }

      .dashboard-section-title {
        font-size: var(--font-size-2xl);
      }
    }
  `],
})
export class AdminDashboardComponent implements OnInit {
  currentUser: Session | null = null;
  posts: Post[] = [];
  users: User[] = [];
  recentPosts: Post[] = [];

  totalPosts: number = 0;
  totalUsers: number = 0;
  adminCount: number = 0;
  viewerCount: number = 0;

  showDeleteConfirm: boolean = false;
  isDeleting: boolean = false;
  errorMessage: string = '';
  private deletePostId: string | null = null;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/blogs', 'edit', postId]);
  }

  onDeletePost(postId: string): void {
    this.errorMessage = '';
    this.deletePostId = postId;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletePostId = null;
    this.errorMessage = '';
  }

  confirmDelete(): void {
    if (!this.deletePostId) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    const result = this.blogService.deletePost(this.deletePostId);

    if (result.success) {
      this.showDeleteConfirm = false;
      this.deletePostId = null;
      this.loadData();
    } else {
      this.errorMessage = result.error ?? 'An error occurred while deleting the post.';
    }

    this.isDeleting = false;
  }

  private loadData(): void {
    this.posts = this.blogService.getAllPosts();
    this.users = this.userService.getAllUsers();

    this.totalPosts = this.posts.length;
    this.totalUsers = this.users.length + 1; // +1 for hard-coded admin
    this.adminCount = this.users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
    this.viewerCount = this.users.filter((u) => u.role === 'viewer').length;

    this.recentPosts = this.posts.slice(0, 5);
  }
}