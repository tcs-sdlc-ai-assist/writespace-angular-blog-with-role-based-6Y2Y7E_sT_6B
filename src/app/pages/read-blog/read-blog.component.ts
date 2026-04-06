import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { BlogService } from '@app/services/blog.service';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import type { Session } from '@app/models/user.model';
import type { Post } from '@app/models/post.model';

@Component({
  selector: 'app-read-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AvatarComponent],
  template: `
    <div class="read-blog-page">
      <app-navbar></app-navbar>
      <div class="read-blog-content">
        <div class="container container-narrow">
          <ng-container *ngIf="post; else notFound">
            <div class="read-blog-header">
              <a routerLink="/blogs" class="back-link">← Back to Blogs</a>
              <h1 class="read-blog-title">{{ post.title }}</h1>
              <div class="read-blog-meta">
                <div class="read-blog-author">
                  <app-avatar
                    [role]="post.authorId === 'admin-001' ? 'admin' : 'viewer'"
                    [displayName]="post.authorName"
                    size="md"
                  ></app-avatar>
                  <div class="read-blog-author-info">
                    <span class="read-blog-author-name">{{ post.authorName }}</span>
                    <span class="read-blog-date">{{ formattedDate }}</span>
                  </div>
                </div>
                <div class="read-blog-actions" *ngIf="canEdit || canDelete">
                  <button
                    *ngIf="canEdit"
                    class="btn btn-sm btn-outline-secondary"
                    (click)="onEdit()"
                    aria-label="Edit post"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    *ngIf="canDelete"
                    class="btn btn-sm btn-outline-secondary read-blog-delete-btn"
                    (click)="onDelete()"
                    aria-label="Delete post"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>

            <div class="read-blog-card card">
              <div class="card-body read-blog-card-body">
                <div class="read-blog-body">{{ post.content }}</div>
              </div>
            </div>
          </ng-container>

          <ng-template #notFound>
            <div class="not-found card">
              <div class="card-body not-found-body text-center">
                <span class="not-found-icon">🔍</span>
                <h2 class="not-found-title">Post not found</h2>
                <p class="not-found-text">
                  The blog post you're looking for doesn't exist or has been removed.
                </p>
                <a routerLink="/blogs" class="btn btn-primary">
                  ← Back to Blogs
                </a>
              </div>
            </div>
          </ng-template>

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

    .read-blog-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
    }

    .read-blog-content {
      padding: var(--spacing-8) 0;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-primary);
      text-decoration: none;
      margin-bottom: var(--spacing-6);
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: var(--color-primary-hover);
    }

    .read-blog-header {
      margin-bottom: var(--spacing-8);
    }

    .read-blog-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
      margin-bottom: var(--spacing-6);
    }

    .read-blog-meta {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .read-blog-author {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .read-blog-author-info {
      display: flex;
      flex-direction: column;
    }

    .read-blog-author-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    .read-blog-date {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .read-blog-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .read-blog-delete-btn {
      color: var(--color-error);
      border-color: var(--color-error);
    }

    .read-blog-delete-btn:hover {
      background-color: var(--color-error-light);
      color: var(--color-error);
      border-color: var(--color-error);
    }

    .read-blog-card {
      border: none;
      box-shadow: var(--shadow-md);
    }

    .read-blog-card-body {
      padding: var(--spacing-8);
    }

    .read-blog-body {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .not-found {
      max-width: 480px;
      margin: 0 auto;
    }

    .not-found-body {
      padding: var(--spacing-10);
    }

    .not-found-icon {
      font-size: var(--font-size-5xl);
      display: block;
      margin-bottom: var(--spacing-4);
      line-height: 1;
    }

    .not-found-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .not-found-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-6);
    }

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
      .read-blog-content {
        padding: var(--spacing-12) 0;
      }

      .read-blog-title {
        font-size: var(--font-size-4xl);
      }

      .read-blog-meta {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .read-blog-card-body {
        padding: var(--spacing-10);
      }
    }
  `],
})
export class ReadBlogComponent implements OnInit {
  post: Post | null = null;
  currentUser: Session | null = null;
  showDeleteConfirm: boolean = false;
  isDeleting: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.post = this.blogService.getPostById(postId);
    }
  }

  get canEdit(): boolean {
    if (!this.currentUser || !this.post) {
      return false;
    }
    if (this.currentUser.role === 'admin') {
      return true;
    }
    return this.currentUser.user_id === this.post.authorId;
  }

  get canDelete(): boolean {
    if (!this.currentUser || !this.post) {
      return false;
    }
    if (this.currentUser.role === 'admin') {
      return true;
    }
    return this.currentUser.user_id === this.post.authorId;
  }

  get formattedDate(): string {
    if (!this.post || !this.post.createdAt) {
      return '';
    }
    try {
      const date = new Date(this.post.createdAt);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  onEdit(): void {
    if (this.post) {
      this.router.navigate(['/blogs', 'edit', this.post.id]);
    }
  }

  onDelete(): void {
    this.errorMessage = '';
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.errorMessage = '';
  }

  confirmDelete(): void {
    if (!this.post) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    const result = this.blogService.deletePost(this.post.id);

    if (result.success) {
      this.showDeleteConfirm = false;
      this.router.navigate(['/blogs']);
    } else {
      this.errorMessage = result.error ?? 'An error occurred while deleting the post.';
    }

    this.isDeleting = false;
  }
}