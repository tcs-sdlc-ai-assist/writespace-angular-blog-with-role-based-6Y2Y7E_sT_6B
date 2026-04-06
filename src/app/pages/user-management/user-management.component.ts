import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { UserService } from '@app/services/user.service';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { AvatarComponent } from '@app/components/avatar/avatar.component';
import type { Session, User, UserRole } from '@app/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, AvatarComponent],
  template: `
    <div class="user-management-page">
      <app-navbar></app-navbar>
      <div class="user-management-content">
        <div class="container">
          <!-- Header -->
          <div class="user-management-header">
            <div class="user-management-header-text">
              <h1 class="user-management-title">👥 User Management</h1>
              <p class="user-management-subtitle">
                Manage users on your WriteSpace platform. Create new users or remove existing ones.
              </p>
            </div>
          </div>

          <!-- Create User Form -->
          <div class="create-user-section">
            <h2 class="section-title">Create New User</h2>

            <div
              *ngIf="createErrorMessage"
              class="form-error-banner"
              role="alert"
            >
              <span class="form-error-icon">⚠️</span>
              <span>{{ createErrorMessage }}</span>
            </div>

            <div
              *ngIf="createSuccessMessage"
              class="form-success-banner"
              role="status"
            >
              <span class="form-success-icon">✅</span>
              <span>{{ createSuccessMessage }}</span>
            </div>

            <div class="create-user-card card">
              <div class="card-body create-user-card-body">
                <form
                  [formGroup]="createUserForm"
                  (ngSubmit)="onCreateUser()"
                  class="create-user-form"
                  novalidate
                >
                  <div class="form-row">
                    <div class="form-group">
                      <label for="display_name" class="form-label">Display Name</label>
                      <input
                        id="display_name"
                        type="text"
                        class="form-input"
                        [class.is-error]="isFieldInvalid('display_name')"
                        formControlName="display_name"
                        placeholder="Enter display name"
                        autocomplete="name"
                      />
                      <span
                        *ngIf="isFieldInvalid('display_name')"
                        class="form-error"
                      >
                        <ng-container *ngIf="createUserForm.get('display_name')?.errors?.['required']">
                          Display name is required.
                        </ng-container>
                        <ng-container *ngIf="createUserForm.get('display_name')?.errors?.['minlength']">
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
                        <ng-container *ngIf="createUserForm.get('username')?.errors?.['required']">
                          Username is required.
                        </ng-container>
                        <ng-container *ngIf="createUserForm.get('username')?.errors?.['minlength']">
                          Username must be at least 3 characters.
                        </ng-container>
                      </span>
                    </div>
                  </div>

                  <div class="form-row">
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
                        <ng-container *ngIf="createUserForm.get('password')?.errors?.['required']">
                          Password is required.
                        </ng-container>
                        <ng-container *ngIf="createUserForm.get('password')?.errors?.['minlength']">
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
                        placeholder="Confirm password"
                        autocomplete="new-password"
                      />
                      <span
                        *ngIf="isFieldInvalid('confirm_password')"
                        class="form-error"
                      >
                        <ng-container *ngIf="createUserForm.get('confirm_password')?.errors?.['required']">
                          Please confirm the password.
                        </ng-container>
                        <ng-container *ngIf="createUserForm.get('confirm_password')?.errors?.['passwordMismatch']">
                          Passwords do not match.
                        </ng-container>
                      </span>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="role" class="form-label">Role</label>
                      <select
                        id="role"
                        class="form-select"
                        formControlName="role"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div class="form-group form-group-action">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                        [disabled]="isCreating"
                      >
                        {{ isCreating ? 'Creating...' : '➕ Create User' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Users Table -->
          <div class="users-table-section">
            <h2 class="section-title">All Users</h2>
            <ng-container *ngIf="allUsersDisplay.length > 0; else emptyUsers">
              <div class="users-table-card card">
                <div class="users-table-wrapper">
                  <table class="users-table">
                    <thead>
                      <tr>
                        <th class="table-th">User</th>
                        <th class="table-th">Username</th>
                        <th class="table-th">Role</th>
                        <th class="table-th">Created</th>
                        <th class="table-th table-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of allUsersDisplay" class="table-row">
                        <td class="table-td">
                          <div class="table-user">
                            <app-avatar
                              [role]="user.role"
                              [displayName]="user.display_name"
                              size="sm"
                            ></app-avatar>
                            <span class="table-user-name">{{ user.display_name }}</span>
                          </div>
                        </td>
                        <td class="table-td">
                          <span class="table-username">{{ user.username }}</span>
                        </td>
                        <td class="table-td">
                          <span
                            class="badge"
                            [ngClass]="user.role === 'admin' ? 'badge-admin' : 'badge-reader'"
                          >
                            {{ user.role === 'admin' ? '👑 Admin' : '📖 Viewer' }}
                          </span>
                        </td>
                        <td class="table-td">
                          <span class="table-date">{{ formatDate(user.created_at) }}</span>
                        </td>
                        <td class="table-td table-td-actions">
                          <button
                            *ngIf="canDeleteUser(user)"
                            class="btn btn-sm btn-outline-secondary table-delete-btn"
                            (click)="onDeleteUser(user.id)"
                            aria-label="Delete user"
                          >
                            🗑️ Delete
                          </button>
                          <span
                            *ngIf="!canDeleteUser(user)"
                            class="table-protected-label"
                          >
                            —
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ng-container>
            <ng-template #emptyUsers>
              <div class="empty-state card">
                <div class="card-body empty-state-body text-center">
                  <span class="empty-state-icon">👥</span>
                  <h3 class="empty-state-title">No users yet</h3>
                  <p class="empty-state-text">
                    Create your first user using the form above.
                  </p>
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
                <h3 class="delete-dialog-title">Delete User</h3>
                <p class="delete-dialog-text">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                <div
                  *ngIf="deleteErrorMessage"
                  class="delete-error"
                  role="alert"
                >
                  <span>{{ deleteErrorMessage }}</span>
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

    .user-management-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
    }

    .user-management-content {
      padding: var(--spacing-8) 0;
    }

    .user-management-header {
      margin-bottom: var(--spacing-8);
    }

    .user-management-header-text {
      flex: 1;
    }

    .user-management-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .user-management-subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      margin-bottom: 0;
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-4);
    }

    /* Create User Section */
    .create-user-section {
      margin-bottom: var(--spacing-10);
    }

    .create-user-card {
      border: none;
      box-shadow: var(--shadow-md);
    }

    .create-user-card-body {
      padding: var(--spacing-8);
    }

    .create-user-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .form-group-action {
      display: flex;
      align-items: flex-end;
    }

    .form-error-banner {
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

    .form-error-icon {
      flex-shrink: 0;
      line-height: 1;
    }

    .form-success-banner {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--color-teal-100);
      color: var(--color-teal-700);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-6);
    }

    .form-success-icon {
      flex-shrink: 0;
      line-height: 1;
    }

    /* Users Table Section */
    .users-table-section {
      margin-bottom: var(--spacing-8);
    }

    .users-table-card {
      border: none;
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .users-table-wrapper {
      overflow-x: auto;
    }

    .users-table {
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

    .table-user {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .table-user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      white-space: nowrap;
    }

    .table-username {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-family: var(--font-family-mono);
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

    .table-protected-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
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
      margin-bottom: 0;
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
      .user-management-content {
        padding: var(--spacing-12) 0;
      }

      .user-management-title {
        font-size: var(--font-size-4xl);
      }

      .section-title {
        font-size: var(--font-size-2xl);
      }

      .create-user-card-body {
        padding: var(--spacing-10);
      }

      .form-row {
        flex-direction: row;
        gap: var(--spacing-6);
      }

      .form-row .form-group {
        flex: 1;
      }
    }
  `],
})
export class UserManagementComponent implements OnInit {
  currentUser: Session | null = null;
  users: User[] = [];
  allUsersDisplay: UserDisplay[] = [];

  createUserForm: FormGroup;
  createErrorMessage: string = '';
  createSuccessMessage: string = '';
  isCreating: boolean = false;

  showDeleteConfirm: boolean = false;
  isDeleting: boolean = false;
  deleteErrorMessage: string = '';
  private deleteUserId: string | null = null;

  private readonly ADMIN_USER_ID = 'admin-001';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.createUserForm = this.fb.group({
      display_name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
      role: ['viewer'],
    }, {
      validators: [this.passwordMatchValidator],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.createUserForm.get(fieldName);
    if (field === null) {
      return false;
    }
    if (fieldName === 'confirm_password' && field.valid && this.createUserForm.errors?.['passwordMismatch']) {
      field.setErrors({ passwordMismatch: true });
    }
    return field.invalid && (field.dirty || field.touched);
  }

  onCreateUser(): void {
    this.createErrorMessage = '';
    this.createSuccessMessage = '';

    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      const confirmControl = this.createUserForm.get('confirm_password');
      if (confirmControl && this.createUserForm.errors?.['passwordMismatch']) {
        confirmControl.setErrors({ passwordMismatch: true });
      }
      return;
    }

    this.isCreating = true;

    const { display_name, username, password, confirm_password, role } = this.createUserForm.value;

    if (password !== confirm_password) {
      this.createErrorMessage = 'Passwords do not match.';
      this.isCreating = false;
      return;
    }

    const result = this.userService.createUser({
      display_name,
      username,
      password,
      role: role as UserRole,
    });

    if (result.success && result.user) {
      this.createSuccessMessage = `User "${result.user.display_name}" created successfully!`;
      this.createUserForm.reset({ role: 'viewer' });
      this.loadUsers();
    } else {
      this.createErrorMessage = result.error ?? 'An error occurred while creating the user.';
    }

    this.isCreating = false;
  }

  canDeleteUser(user: UserDisplay): boolean {
    if (user.id === this.ADMIN_USER_ID) {
      return false;
    }
    if (this.currentUser && user.id === this.currentUser.user_id) {
      return false;
    }
    return true;
  }

  onDeleteUser(userId: string): void {
    this.deleteErrorMessage = '';
    this.deleteUserId = userId;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteUserId = null;
    this.deleteErrorMessage = '';
  }

  confirmDelete(): void {
    if (!this.deleteUserId) {
      return;
    }

    this.isDeleting = true;
    this.deleteErrorMessage = '';

    const result = this.userService.deleteUser(this.deleteUserId);

    if (result.success) {
      this.showDeleteConfirm = false;
      this.deleteUserId = null;
      this.loadUsers();
    } else {
      this.deleteErrorMessage = result.error ?? 'An error occurred while deleting the user.';
    }

    this.isDeleting = false;
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

  private loadUsers(): void {
    this.users = this.userService.getAllUsers();

    const adminUser: UserDisplay = {
      id: this.ADMIN_USER_ID,
      display_name: 'Administrator',
      username: 'admin',
      password: '',
      role: 'admin',
      created_at: '',
    };

    this.allUsersDisplay = [adminUser, ...this.users];
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

interface UserDisplay {
  id: string;
  display_name: string;
  username: string;
  password: string;
  role: UserRole;
  created_at: string;
}