import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import { ExcerptPipe } from '@app/pipes/excerpt.pipe';
import type { Post } from '@app/models/post.model';
import type { Session } from '@app/models/user.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, AvatarComponent, ExcerptPipe],
  template: `
    <article class="post-card card card-interactive" (click)="onRead()">
      <div class="post-card-body">
        <div class="post-card-header">
          <div class="post-card-meta">
            <app-avatar
              [role]="post.authorId === 'admin-001' ? 'admin' : 'viewer'"
              [displayName]="post.authorName"
              size="sm"
            ></app-avatar>
            <div class="post-card-meta-text">
              <span class="post-card-author">{{ post.authorName }}</span>
              <span class="post-card-date">{{ formattedDate }}</span>
            </div>
          </div>
          <button
            *ngIf="canEdit"
            class="btn btn-sm btn-outline-secondary post-card-edit-btn"
            (click)="onEdit($event)"
            aria-label="Edit post"
          >
            ✏️ Edit
          </button>
        </div>
        <h3 class="post-card-title">{{ post.title }}</h3>
        <p class="post-card-excerpt">{{ post.content | excerpt:150 }}</p>
      </div>
      <div class="post-card-footer">
        <span class="post-card-read-more">Read more →</span>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .post-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      cursor: pointer;
    }

    .post-card-body {
      padding: var(--spacing-6);
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .post-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-4);
    }

    .post-card-meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      min-width: 0;
    }

    .post-card-meta-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .post-card-author {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .post-card-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .post-card-edit-btn {
      flex-shrink: 0;
    }

    .post-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
      margin-bottom: var(--spacing-3);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-card-excerpt {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
      margin-bottom: 0;
      flex: 1;
    }

    .post-card-footer {
      padding: var(--spacing-4) var(--spacing-6);
      border-top: 1px solid var(--color-border);
      background-color: var(--color-bg-secondary);
    }

    .post-card-read-more {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary);
      transition: color var(--transition-fast);
    }

    .post-card:hover .post-card-read-more {
      color: var(--color-primary-hover);
    }
  `],
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() currentUser: Session | null = null;

  @Output() readPost = new EventEmitter<string>();
  @Output() editPost = new EventEmitter<string>();

  get canEdit(): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (this.currentUser.role === 'admin') {
      return true;
    }
    return this.currentUser.user_id === this.post.authorId;
  }

  get formattedDate(): string {
    if (!this.post.createdAt) {
      return '';
    }
    try {
      const date = new Date(this.post.createdAt);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  onRead(): void {
    this.readPost.emit(this.post.id);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.editPost.emit(this.post.id);
  }
}