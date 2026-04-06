import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { BlogService } from '@app/services/blog.service';
import { PostCardComponent } from '@app/components/post-card/post-card.component';
import type { Session } from '@app/models/user.model';
import type { Post } from '@app/models/post.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent],
  template: `
    <div class="blog-list-page">
      <app-navbar></app-navbar>
      <div class="blog-list-content">
        <div class="container">
          <div class="blog-list-header">
            <div class="blog-list-header-text">
              <h1 class="blog-list-title">📚 All Blog Posts</h1>
              <p class="blog-list-subtitle">
                Explore the latest thoughts and stories from our community.
              </p>
            </div>
            <a
              routerLink="/blogs/write"
              class="btn btn-primary"
            >
              ✏️ Write a Post
            </a>
          </div>

          <ng-container *ngIf="posts.length > 0; else emptyState">
            <div class="blog-list-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <app-post-card
                *ngFor="let post of posts"
                [post]="post"
                [currentUser]="currentUser"
                (readPost)="onReadPost($event)"
                (editPost)="onEditPost($event)"
              ></app-post-card>
            </div>
          </ng-container>

          <ng-template #emptyState>
            <div class="empty-state card">
              <div class="card-body empty-state-body text-center">
                <span class="empty-state-icon">📝</span>
                <h3 class="empty-state-title">No posts yet</h3>
                <p class="empty-state-text">
                  Be the first to share your thoughts on WriteSpace!
                </p>
                <a
                  routerLink="/blogs/write"
                  class="btn btn-primary"
                >
                  Write Your First Post
                </a>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .blog-list-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
    }

    .blog-list-content {
      padding: var(--spacing-8) 0;
    }

    .blog-list-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-8);
    }

    .blog-list-header-text {
      flex: 1;
    }

    .blog-list-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .blog-list-subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      margin-bottom: 0;
    }

    .blog-list-grid {
      gap: var(--spacing-6);
    }

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

    @media (min-width: 768px) {
      .blog-list-content {
        padding: var(--spacing-12) 0;
      }

      .blog-list-header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .blog-list-title {
        font-size: var(--font-size-4xl);
      }
    }
  `],
})
export class BlogListComponent implements OnInit {
  currentUser: Session | null = null;
  posts: Post[] = [];

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPosts();
  }

  onReadPost(postId: string): void {
    this.router.navigate(['/blogs', postId]);
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/blogs', 'edit', postId]);
  }

  private loadPosts(): void {
    this.posts = this.blogService.getAllPosts();
  }
}