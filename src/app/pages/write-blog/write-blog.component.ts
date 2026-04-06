import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { BlogService } from '@app/services/blog.service';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import type { Session } from '@app/models/user.model';
import type { Post } from '@app/models/post.model';

@Component({
  selector: 'app-write-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  template: `
    <div class="write-blog-page">
      <app-navbar></app-navbar>
      <div class="write-blog-content">
        <div class="container container-narrow">
          <div class="write-blog-header">
            <h1 class="write-blog-title">{{ isEditMode ? '✏️ Edit Post' : '📝 Write a New Post' }}</h1>
            <p class="write-blog-subtitle">
              {{ isEditMode ? 'Update your blog post below.' : 'Share your thoughts with the WriteSpace community.' }}
            </p>
          </div>

          <div
            *ngIf="errorMessage"
            class="write-blog-error"
            role="alert"
          >
            <span class="write-blog-error-icon">⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="write-blog-card card">
            <div class="card-body write-blog-card-body">
              <form
                [formGroup]="postForm"
                (ngSubmit)="onSubmit()"
                class="write-blog-form"
                novalidate
              >
                <div class="form-group">
                  <label for="title" class="form-label">Title</label>
                  <input
                    id="title"
                    type="text"
                    class="form-input"
                    [class.is-error]="isFieldInvalid('title')"
                    formControlName="title"
                    placeholder="Enter your post title"
                    maxlength="100"
                  />
                  <div class="form-meta">
                    <span
                      *ngIf="isFieldInvalid('title')"
                      class="form-error"
                    >
                      <ng-container *ngIf="postForm.get('title')?.errors?.['required']">
                        Title is required.
                      </ng-container>
                      <ng-container *ngIf="postForm.get('title')?.errors?.['maxlength']">
                        Title must be at most 100 characters.
                      </ng-container>
                    </span>
                    <span class="form-hint char-count">
                      {{ postForm.get('title')?.value?.length || 0 }} / 100
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="content" class="form-label">Content</label>
                  <textarea
                    id="content"
                    class="form-textarea"
                    [class.is-error]="isFieldInvalid('content')"
                    formControlName="content"
                    placeholder="Write your blog post content here..."
                    rows="12"
                    maxlength="5000"
                  ></textarea>
                  <div class="form-meta">
                    <span
                      *ngIf="isFieldInvalid('content')"
                      class="form-error"
                    >
                      <ng-container *ngIf="postForm.get('content')?.errors?.['required']">
                        Content is required.
                      </ng-container>
                      <ng-container *ngIf="postForm.get('content')?.errors?.['maxlength']">
                        Content must be at most 5000 characters.
                      </ng-container>
                    </span>
                    <span class="form-hint char-count">
                      {{ postForm.get('content')?.value?.length || 0 }} / 5000
                    </span>
                  </div>
                </div>

                <div class="write-blog-actions">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    (click)="onCancel()"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="isSubmitting"
                  >
                    {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Post' : 'Publish Post') }}
                  </button>
                </div>
              </form>
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

    .write-blog-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
    }

    .write-blog-content {
      padding: var(--spacing-8) 0;
    }

    .write-blog-header {
      margin-bottom: var(--spacing-8);
    }

    .write-blog-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .write-blog-subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      margin-bottom: 0;
    }

    .write-blog-error {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--color-error-light);
      color: var(--color-error);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-6);
    }

    .write-blog-error-icon {
      flex-shrink: 0;
      line-height: 1;
    }

    .write-blog-card {
      border: none;
      box-shadow: var(--shadow-md);
    }

    .write-blog-card-body {
      padding: var(--spacing-8);
    }

    .write-blog-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .form-meta {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-top: var(--spacing-1);
    }

    .char-count {
      margin-left: auto;
      flex-shrink: 0;
    }

    .write-blog-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-3);
      margin-top: var(--spacing-6);
    }

    @media (min-width: 768px) {
      .write-blog-content {
        padding: var(--spacing-12) 0;
      }

      .write-blog-title {
        font-size: var(--font-size-4xl);
      }

      .write-blog-card-body {
        padding: var(--spacing-10);
      }
    }
  `],
})
export class WriteBlogComponent implements OnInit {
  postForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  currentUser: Session | null = null;

  private postId: string | null = null;
  private existingPost: Post | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(5000)]],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.isEditMode = true;
      this.loadPost(this.postId);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.postForm.get(fieldName);
    return field !== null && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { title, content } = this.postForm.value;

    if (this.isEditMode && this.postId) {
      const result = this.blogService.updatePost(this.postId, { title, content });

      if (result.success) {
        this.router.navigate(['/blogs', this.postId]);
      } else {
        this.errorMessage = result.error ?? 'An error occurred while updating the post.';
      }
    } else {
      const result = this.blogService.createPost({ title, content });

      if (result.success && result.post) {
        this.router.navigate(['/blogs']);
      } else {
        this.errorMessage = result.error ?? 'An error occurred while creating the post.';
      }
    }

    this.isSubmitting = false;
  }

  onCancel(): void {
    if (this.isEditMode && this.postId) {
      this.router.navigate(['/blogs', this.postId]);
    } else {
      this.router.navigate(['/blogs']);
    }
  }

  private loadPost(postId: string): void {
    this.existingPost = this.blogService.getPostById(postId);

    if (!this.existingPost) {
      this.errorMessage = 'Post not found.';
      this.router.navigate(['/blogs']);
      return;
    }

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.currentUser.role !== 'admin' && this.existingPost.authorId !== this.currentUser.user_id) {
      this.errorMessage = 'You are not authorized to edit this post.';
      this.router.navigate(['/blogs']);
      return;
    }

    this.postForm.patchValue({
      title: this.existingPost.title,
      content: this.existingPost.content,
    });
  }
}