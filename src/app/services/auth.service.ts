import { Injectable } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import type { User, Session, UserRole } from '@app/models/user.model';

export interface AuthResult {
  success: boolean;
  user?: Session;
  error?: string;
}

export interface RegisterInput {
  display_name: string;
  username: string;
  password: string;
  confirm_password: string;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_DISPLAY_NAME = 'Administrator';
const ADMIN_USER_ID = 'admin-001';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private storageService: StorageService) {}

  login(username: string, password: string): Promise<AuthResult> {
    return new Promise((resolve) => {
      if (!username || !password) {
        resolve({ success: false, error: 'Username and password are required.' });
        return;
      }

      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedPassword) {
        resolve({ success: false, error: 'Username and password are required.' });
        return;
      }

      if (
        trimmedUsername.toLowerCase() === ADMIN_USERNAME &&
        trimmedPassword === ADMIN_PASSWORD
      ) {
        const session: Session = {
          user_id: ADMIN_USER_ID,
          username: ADMIN_USERNAME,
          display_name: ADMIN_DISPLAY_NAME,
          role: 'admin',
        };
        this.storageService.saveSession(session);
        resolve({ success: true, user: session });
        return;
      }

      try {
        const users = this.storageService.getUsers();
        const user = users.find(
          (u) =>
            u.username.toLowerCase() === trimmedUsername.toLowerCase() &&
            u.password === trimmedPassword
        );

        if (!user) {
          resolve({ success: false, error: 'Invalid username or password.' });
          return;
        }

        const session: Session = {
          user_id: user.id,
          username: user.username,
          display_name: user.display_name,
          role: user.role,
        };
        this.storageService.saveSession(session);
        resolve({ success: true, user: session });
      } catch {
        resolve({ success: false, error: 'An error occurred during login. Please try again.' });
      }
    });
  }

  register(input: RegisterInput): Promise<AuthResult> {
    return new Promise((resolve) => {
      const displayName = (input.display_name ?? '').trim();
      const username = (input.username ?? '').trim();
      const password = input.password ?? '';
      const confirmPassword = input.confirm_password ?? '';

      if (!displayName || !username || !password || !confirmPassword) {
        resolve({ success: false, error: 'All fields are required.' });
        return;
      }

      if (displayName.length < 2) {
        resolve({ success: false, error: 'Display name must be at least 2 characters.' });
        return;
      }

      if (username.length < 3) {
        resolve({ success: false, error: 'Username must be at least 3 characters.' });
        return;
      }

      if (password.length < 6) {
        resolve({ success: false, error: 'Password must be at least 6 characters.' });
        return;
      }

      if (password !== confirmPassword) {
        resolve({ success: false, error: 'Passwords do not match.' });
        return;
      }

      if (username.toLowerCase() === ADMIN_USERNAME) {
        resolve({ success: false, error: 'Username already exists.' });
        return;
      }

      try {
        const users = this.storageService.getUsers();
        const exists = users.some(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (exists) {
          resolve({ success: false, error: 'Username already exists.' });
          return;
        }

        const newUser: User = {
          id: this.generateUUID(),
          display_name: displayName,
          username: username,
          password: password,
          role: 'viewer' as UserRole,
          created_at: new Date().toISOString(),
        };

        users.push(newUser);
        this.storageService.saveUsers(users);

        const session: Session = {
          user_id: newUser.id,
          username: newUser.username,
          display_name: newUser.display_name,
          role: newUser.role,
        };
        this.storageService.saveSession(session);
        resolve({ success: true, user: session });
      } catch {
        resolve({ success: false, error: 'An error occurred during registration. Please try again.' });
      }
    });
  }

  logout(): void {
    this.storageService.clearSession();
  }

  getCurrentUser(): Session | null {
    return this.storageService.getSession();
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'admin';
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}