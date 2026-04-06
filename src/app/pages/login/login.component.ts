import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-card card">
          <div class="card-body login-card-body">
            <div class="login-header">
              <span class="login-icon">✍️</span>
              <h1 class="login-title">Welcome Back</h1>
              <p class="login-subtitle">Sign in to your WriteSpace account</p>
            </div>

            <div
              *ngIf="errorMessage"
              class="login-error"
              role="alert"
            >
              <span class="login-error-icon">⚠️</span>
              <span>{{ errorMessage }}</span>
            </div>

            <form
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
              class="login-form"
              novalidate
            >
              <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input
                  id="username"
                  type="text"
                  class="form-input"
                  [class.is-error]="isFieldInvalid('username')"
                  formControlName="username"
                  placeholder="Enter your username"
                  autocomplete="username"
                />
                <span
                  *ngIf="isFieldInvalid('username')"
                  class="form-error"
                >
                  Username is required.
                </span>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  class="form-input"
                  [class.is-error]="isFieldInvalid('password')"
                  formControlName="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
                <span
                  *ngIf="isFieldInvalid('password')"
                  class="form-error"
                >
                  Password is required.
                </span>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-block btn-lg"
                [disabled]="isSubmitting"
              >
                {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <div class="login-footer">
              <p class="login-footer-text">
                Don't have an account?
                <a routerLink="/register" class="login-footer-link">Create one</a>
              </p>
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

    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-indigo-700) 0%, var(--color-violet-600) 50%, var(--color-pink-500) 100%);
      padding: var(--spacing-4);
    }

    .login-container {
      width: 100%;
      max-width: 440px;
    }

    .login-card {
      border: none;
      box-shadow: var(--shadow-xl);
    }

    .login-card-body {
      padding: var(--spacing-8);
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--spacing-8);
    }

    .login-icon {
      font-size: var(--font-size-5xl);
      display: block;
      margin-bottom: var(--spacing-4);
      line-height: 1;
    }

    .login-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .login-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: 0;
    }

    .login-error {
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

    .login-error-icon {
      flex-shrink: 0;
      line-height: 1;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .login-form .form-group:last-of-type {
      margin-bottom: var(--spacing-6);
    }

    .login-footer {
      margin-top: var(--spacing-6);
      text-align: center;
    }

    .login-footer-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: 0;
    }

    .login-footer-link {
      color: var(--color-primary);
      font-weight: var(--font-weight-semibold);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .login-footer-link:hover {
      color: var(--color-primary-hover);
    }

    @media (min-width: 768px) {
      .login-card-body {
        padding: var(--spacing-10);
      }
    }
  `],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field !== null && field.invalid && (field.dirty || field.touched);
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const { username, password } = this.loginForm.value;
      const result = await this.authService.login(username, password);

      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/blogs']);
        }
      } else {
        this.errorMessage = result.error ?? 'Invalid username or password.';
      }
    } catch {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}