import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import type { Session } from '@app/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent],
  template: `
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="navbar-container container">
        <div class="navbar-brand">
          <a routerLink="/" class="navbar-logo" aria-label="WriteSpace Home">
            <span class="navbar-logo-icon">✍️</span>
            <span class="navbar-logo-text">WriteSpace</span>
          </a>
        </div>

        <button
          class="navbar-toggle btn btn-ghost btn-icon"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="mobileMenuOpen"
          aria-controls="navbar-menu"
          aria-label="Toggle navigation menu"
        >
          <span class="navbar-toggle-icon">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>

        <div
          id="navbar-menu"
          class="navbar-menu"
          [class.navbar-menu-open]="mobileMenuOpen"
        >
          <ul class="navbar-links">
            <li>
              <a
                routerLink="/"
                routerLinkActive="navbar-link-active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="navbar-link"
                (click)="closeMobileMenu()"
              >
                Home
              </a>
            </li>
            <li *ngIf="currentUser">
              <a
                routerLink="/blogs"
                routerLinkActive="navbar-link-active"
                class="navbar-link"
                (click)="closeMobileMenu()"
              >
                Blogs
              </a>
            </li>
            <li *ngIf="currentUser && currentUser.role === 'admin'">
              <a
                routerLink="/admin/dashboard"
                routerLinkActive="navbar-link-active"
                class="navbar-link"
                (click)="closeMobileMenu()"
              >
                Dashboard
              </a>
            </li>
            <li *ngIf="currentUser && currentUser.role === 'admin'">
              <a
                routerLink="/admin/users"
                routerLinkActive="navbar-link-active"
                class="navbar-link"
                (click)="closeMobileMenu()"
              >
                Users
              </a>
            </li>
          </ul>

          <div class="navbar-actions">
            <ng-container *ngIf="currentUser; else guestActions">
              <div class="navbar-user">
                <app-avatar
                  [role]="currentUser.role"
                  [displayName]="currentUser.display_name"
                  size="sm"
                ></app-avatar>
                <span class="navbar-user-name">{{ currentUser.display_name }}</span>
              </div>
              <button
                class="btn btn-sm btn-outline-secondary"
                (click)="logout()"
              >
                Logout
              </button>
            </ng-container>
            <ng-template #guestActions>
              <a
                routerLink="/login"
                routerLinkActive="navbar-link-active"
                class="btn btn-sm btn-outline"
                (click)="closeMobileMenu()"
              >
                Login
              </a>
              <a
                routerLink="/register"
                routerLinkActive="navbar-link-active"
                class="btn btn-sm btn-primary"
                (click)="closeMobileMenu()"
              >
                Register
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: var(--z-sticky, 200);
    }

    .navbar {
      background-color: var(--color-bg-primary);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      height: var(--header-height, 4rem);
      display: flex;
      align-items: center;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .navbar-logo {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      text-decoration: none;
      color: var(--color-text-primary);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xl);
      transition: color var(--transition-fast);
    }

    .navbar-logo:hover {
      color: var(--color-primary);
    }

    .navbar-logo-icon {
      font-size: var(--font-size-2xl);
      line-height: 1;
    }

    .navbar-logo-text {
      background: linear-gradient(135deg, var(--color-indigo-600), var(--color-violet-600));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .navbar-toggle {
      display: flex;
      font-size: var(--font-size-xl);
    }

    .navbar-toggle-icon {
      line-height: 1;
    }

    .navbar-menu {
      display: none;
      flex-direction: column;
      position: absolute;
      top: var(--header-height, 4rem);
      left: 0;
      right: 0;
      background-color: var(--color-bg-primary);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-md);
      padding: var(--spacing-4);
      gap: var(--spacing-4);
      z-index: var(--z-dropdown, 100);
    }

    .navbar-menu-open {
      display: flex;
    }

    .navbar-links {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .navbar-link {
      display: block;
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: color var(--transition-fast), background-color var(--transition-fast);
    }

    .navbar-link:hover {
      color: var(--color-primary);
      background-color: var(--color-primary-light);
    }

    .navbar-link-active {
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      font-weight: var(--font-weight-semibold);
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      flex-wrap: wrap;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .navbar-user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 150px;
    }

    @media (min-width: 768px) {
      .navbar-toggle {
        display: none;
      }

      .navbar-menu {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: static;
        background-color: transparent;
        border-bottom: none;
        box-shadow: none;
        padding: 0;
        gap: var(--spacing-6);
        flex: 1;
        justify-content: space-between;
        margin-left: var(--spacing-8);
      }

      .navbar-menu-open {
        display: flex;
      }

      .navbar-links {
        flex-direction: row;
        gap: var(--spacing-1);
      }
    }
  `],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: Session | null = null;
  mobileMenuOpen: boolean = false;

  private checkInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshUser();
    this.checkInterval = setInterval(() => {
      this.refreshUser();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  private refreshUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}