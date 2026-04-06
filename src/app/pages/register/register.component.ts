import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-page">
      <div class="register-container">
        <div class="register-card card">
          <div class="card-body register-card-body">
            <div class="register-header">
              <span class="register-icon">🚀</span>
              <h1 class="register-title">Create Account</h1>
              <p class="register-subtitle">Join WriteSpace and start sharing your thoughts</p>
            </div>

            <div
              *ngIf="errorMessage"
              class="register-error"
              role="alert"
            >
              <span class="register-error-icon">⚠️</span>
              <span>{{ errorMessage }}</span>
            </div>

            <form
              [formGroup]="registerForm"
              (ngSubmit)="onSubmit()"
              class="register-form"
              novalidate
            >
              <div class="form-group">
                <label for="display_name" class="form-label">Display Name</label>
                <input
                  id="display_name"
                  type="text"
                  class="form-input"
                  [class.is-error]="isFieldInvalid('display_name')"
                  formControlName="display_name"
                  placeholder="Enter your display name"
                  autocomplete="name"
                />
                <span
                  *ngIf="isFieldInvalid('display_name')"
                  class="form-error"
                >
                  <ng-container *ngIf="registerForm.get('display_name')?.errors?.['required']">
                    Display name is required.
                  </ng-container>
                  <ng-container *ngIf="registerForm.get('display_name')?.errors?.['minlength']">
                    Display name must be at least 2 characters.
                  </ng-container>
                </span>
              </div>

              <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input
                  id="username"
                  type="text"
                  class="form-input"
                  [class.is-error]="isFieldInvalid('username')"
                  formControlName="username"
                  placeholder="Choose a username"
                  autocomplete="username"
                />
                <span
                  *ngIf="isFieldInvalid('username')"
                  class="form-error"
                >
                  <ng-container *ngIf="registerForm.get('username')?.errors?.['required']">
                    Username is required.
                  </ng-container>
                  <ng-container *ngIf="registerForm.get('username')?.errors?.['minlength']">
                    Username must be at least 3 characters.
                  </ng-container>
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
                  placeholder="Create a password"
                  autocomplete="new-password"
                />
                <span
                  *ngIf="isFieldInvalid('password')"
                  class="form-error"
                >
                  <ng-container *ngIf="registerForm.get('password')?.errors?.['required']">
                    Password is required.
                  </ng-container>
                  <ng-container *ngIf="registerForm.get('password')?.errors?.['minlength']">
                    Password must be at least 6 characters.
                  </ng-container>
                </span>
              </div>

              <div class="form-group">
                <label for="confirm_password" class="form-label">Confirm Password</label>
                <input
                  id="confirm_password"
                  type="password"
                  class="form-input"
                  [class.is-error]="isFieldInvalid('confirm_password')"
                  formControlName="confirm_password"
                  placeholder="Confirm your password"
                  autocomplete="new-password"
                />
                <span
                  *ngIf="isFieldInvalid('confirm_password')"
                  class="form-error"
                >
                  <ng-container *ngIf="registerForm.get('confirm_password')?.errors?.['required']">
                    Please confirm your password.
                  </ng-container>
                  <ng-container *ngIf="registerForm.get('confirm_password')?.errors?.['passwordMismatch']">
                    Passwords do not match.
                  </ng-container>
                </span>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-block btn-lg"
                [disabled]="isSubmitting"
              >
                {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
              </button>
            </form>

            <div class="register-footer">
              <p class="register-footer-text">
                Already have an account?
                <a routerLink="/login" class="register-footer-link">Sign in</a>
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

    .register-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-indigo-700) 0%, var(--color-violet-600) 50%, var(--color-pink-500) 100%);
      padding: var(--spacing-4);
    }

    .register-container {
      width: 100%;
      max-width: 440px;
    }

    .register-card {
      border: none;
      box-shadow: var(--shadow-xl);
    }

    .register-card-body {
      padding: var(--spacing-8);
    }

    .register-header {
      text-align: center;
      margin-bottom: var(--spacing-8);
    }

    .register-icon {
      font-size: var(--font-size-5xl);
      display: block;
      margin-bottom: var(--spacing-4);
      line-height: 1;
    }

    .register-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .register-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: 0;
    }

    .register-error {
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

    .register-error-icon {
      flex-shrink: 0;
      line-height: 1;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .register-form .form-group:last-of-type {
      margin-bottom: var(--spacing-6);
    }

    .register-footer {
      margin-top: var(--spacing-6);
      text-align: center;
    }

    .register-footer-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: 0;
    }

    .register-footer-link {
      color: var(--color-primary);
      font-weight: var(--font-weight-semibold);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .register-footer-link:hover {
      color: var(--color-primary-hover);
    }

    @media (min-width: 768px) {
      .register-card-body {
        padding: var(--spacing-10);
      }
    }
  `],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      display_name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
    }, {
      validators: [this.passwordMatchValidator],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (field === null) {
      return false;
    }
    if (fieldName === 'confirm_password' && field.valid && this.registerForm.errors?.['passwordMismatch']) {
      field.setErrors({ passwordMismatch: true });
    }
    return field.invalid && (field.dirty || field.touched);
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      const confirmControl = this.registerForm.get('confirm_password');
      if (confirmControl && this.registerForm.errors?.['passwordMismatch']) {
        confirmControl.setErrors({ passwordMismatch: true });
      }
      return;
    }

    this.isSubmitting = true;

    try {
      const { display_name, username, password, confirm_password } = this.registerForm.value;
      const result = await this.authService.register({
        display_name,
        username,
        password,
        confirm_password,
      });

      if (result.success && result.user) {
        this.router.navigate(['/blogs']);
      } else {
        this.errorMessage = result.error ?? 'Registration failed. Please try again.';
      }
    } catch {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }
}