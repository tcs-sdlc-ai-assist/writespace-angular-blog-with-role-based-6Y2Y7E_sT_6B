import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { BlogService } from '@app/services/blog.service';
import { PostCardComponent } from '@app/components/post-card/post-card.component';
import { Router } from '@angular/router';
import type { Session } from '@app/models/user.model';
import type { Post } from '@app/models/post.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero gradient-hero">
        <div class="container hero-container">
          <h1 class="hero-title animate-fade-in-up">
            <span class="hero-title-icon">✍️</span>
            Welcome to <span class="hero-brand">WriteSpace</span>
          </h1>
          <p class="hero-tagline animate-fade-in-up">
            A modern, privacy-first blogging platform. Write, share, and manage your content — all stored locally in your browser.
          </p>
          <div class="hero-actions animate-fade-in-up">
            <a
              *ngIf="currentUser"
              routerLink="/blogs"
              class="btn btn-lg btn-gradient hero-btn"
            >
              📚 Read Blogs
            </a>
            <a
              *ngIf="!currentUser"
              routerLink="/register"
              class="btn btn-lg btn-gradient hero-btn"
            >
              🚀 Get Started
            </a>
            <a
              *ngIf="!currentUser"
              routerLink="/login"
              class="btn btn-lg btn-outline hero-btn hero-btn-outline"
            >
              Login
            </a>
            <a
              *ngIf="currentUser && currentUser.role === 'admin'"
              routerLink="/admin/dashboard"
              class="btn btn-lg btn-outline hero-btn hero-btn-outline"
            >
              📊 Dashboard
            </a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title text-center">Why WriteSpace?</h2>
          <div class="features-grid grid grid-cols-1 md:grid-cols-3">
            <div class="feature-card card card-gradient animate-fade-in-up">
              <div class="card-body feature-card-body">
                <span class="feature-icon">🔒</span>
                <h3 class="feature-title">Privacy First</h3>
                <p class="feature-description">
                  All your data stays in your browser. No servers, no tracking, no third-party access. Your content is truly yours.
                </p>
              </div>
            </div>
            <div class="feature-card card card-gradient animate-fade-in-up">
              <div class="card-body feature-card-body">
                <span class="feature-icon">👥</span>
                <h3 class="feature-title">Role-Based Access</h3>
                <p class="feature-description">
                  Admins manage users and all content. Viewers create and manage their own posts. Simple, effective permissions.
                </p>
              </div>
            </div>
            <div class="feature-card card card-gradient animate-fade-in-up">
              <div class="card-body feature-card-body">
                <span class="feature-icon">⚡</span>
                <h3 class="feature-title">Instant Performance</h3>
                <p class="feature-description">
                  No loading spinners, no network delays. Everything runs locally for a blazing-fast experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Latest Posts Section -->
      <section class="latest-section">
        <div class="container">
          <h2 class="section-title text-center">Latest Posts</h2>
          <ng-container *ngIf="latestPosts.length > 0; else emptyPosts">
            <div class="latest-grid grid grid-cols-1 md:grid-cols-3">
              <app-post-card
                *ngFor="let post of latestPosts"
                [post]="post"
                [currentUser]="currentUser"
                (readPost)="onReadPost($event)"
                (editPost)="onEditPost($event)"
              ></app-post-card>
            </div>
            <div class="latest-actions text-center" *ngIf="currentUser">
              <a routerLink="/blogs" class="btn btn-outline">
                View All Posts →
              </a>
            </div>
          </ng-container>
          <ng-template #emptyPosts>
            <div class="empty-state card">
              <div class="card-body empty-state-body text-center">
                <span class="empty-state-icon">📝</span>
                <h3 class="empty-state-title">No posts yet</h3>
                <p class="empty-state-text">
                  Be the first to share your thoughts on WriteSpace!
                </p>
                <a
                  *ngIf="currentUser"
                  routerLink="/blogs/write"
                  class="btn btn-primary"
                >
                  Write Your First Post
                </a>
                <a
                  *ngIf="!currentUser"
                  routerLink="/register"
                  class="btn btn-primary"
                >
                  Sign Up to Start Writing
                </a>
              </div>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- Footer -->
      <footer class="home-footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <span class="footer-logo-icon">✍️</span>
              <span class="footer-logo-text">WriteSpace</span>
            </div>
            <nav class="footer-links" aria-label="Footer navigation">
              <a routerLink="/" class="footer-link">Home</a>
              <a *ngIf="currentUser" routerLink="/blogs" class="footer-link">Blogs</a>
              <a *ngIf="!currentUser" routerLink="/login" class="footer-link">Login</a>
              <a *ngIf="!currentUser" routerLink="/register" class="footer-link">Register</a>
              <a *ngIf="currentUser && currentUser.role === 'admin'" routerLink="/admin/dashboard" class="footer-link">Dashboard</a>
            </nav>
            <p class="footer-copyright">
              © {{ currentYear }} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .home-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Hero Section */
    .hero {
      padding: var(--spacing-16) 0;
      color: var(--color-text-inverse);
      text-align: center;
    }

    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-6);
    }

    .hero-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-inverse);
      line-height: var(--line-height-tight);
      margin-bottom: 0;
    }

    .hero-title-icon {
      font-size: var(--font-size-5xl);
      display: block;
      margin-bottom: var(--spacing-4);
    }

    .hero-brand {
      display: inline;
    }

    .hero-tagline {
      font-size: var(--font-size-lg);
      color: rgba(255, 255, 255, 0.85);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin-bottom: 0;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      flex-wrap: wrap;
      justify-content: center;
      margin-top: var(--spacing-4);
    }

    .hero-btn {
      min-width: 160px;
    }

    .hero-btn-outline {
      color: var(--color-text-inverse);
      border-color: rgba(255, 255, 255, 0.5);
      background-color: transparent;
    }

    .hero-btn-outline:hover {
      background-color: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.8);
      color: var(--color-text-inverse);
    }

    /* Features Section */
    .features-section {
      padding: var(--spacing-16) 0;
      background-color: var(--color-bg-secondary);
    }

    .section-title {
      margin-bottom: var(--spacing-10);
    }

    .features-grid {
      gap: var(--spacing-6);
    }

    .feature-card-body {
      text-align: center;
      padding: var(--spacing-8);
    }

    .feature-icon {
      font-size: var(--font-size-5xl);
      display: block;
      margin-bottom: var(--spacing-4);
      line-height: 1;
    }

    .feature-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-3);
    }

    .feature-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
      margin-bottom: 0;
    }

    /* Latest Posts Section */
    .latest-section {
      padding: var(--spacing-16) 0;
      background-color: var(--color-bg-primary);
      flex: 1;
    }

    .latest-grid {
      gap: var(--spacing-6);
    }

    .latest-actions {
      margin-top: var(--spacing-8);
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

    /* Footer */
    .home-footer {
      background-color: var(--color-slate-900);
      color: var(--color-slate-400);
      padding: var(--spacing-10) 0;
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-6);
      text-align: center;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .footer-logo-icon {
      font-size: var(--font-size-2xl);
      line-height: 1;
    }

    .footer-logo-text {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-inverse);
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-6);
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-link {
      font-size: var(--font-size-sm);
      color: var(--color-slate-400);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .footer-link:hover {
      color: var(--color-text-inverse);
    }

    .footer-copyright {
      font-size: var(--font-size-xs);
      color: var(--color-slate-500);
      margin-bottom: 0;
    }

    @media (min-width: 768px) {
      .hero {
        padding: var(--spacing-24) 0;
      }

      .hero-title {
        font-size: var(--font-size-5xl);
      }

      .hero-title-icon {
        display: inline;
        margin-bottom: 0;
      }

      .hero-tagline {
        font-size: var(--font-size-xl);
      }

      .features-section {
        padding: var(--spacing-20) 0;
      }

      .latest-section {
        padding: var(--spacing-20) 0;
      }
    }
  `],
})
export class HomeComponent implements OnInit {
  currentUser: Session | null = null;
  latestPosts: Post[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLatestPosts();
  }

  onReadPost(postId: string): void {
    this.router.navigate(['/blogs', postId]);
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/blogs', 'edit', postId]);
  }

  private loadLatestPosts(): void {
    const allPosts = this.blogService.getAllPosts();
    this.latestPosts = allPosts.slice(0, 3);
  }
}