import { Injectable } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import { AuthService } from '@app/services/auth.service';
import type { User, UserRole } from '@app/models/user.model';

export interface UserCreateInput {
  display_name: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UserResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UserDeleteResult {
  success: boolean;
  error?: string;
}

const ADMIN_USER_ID = 'admin-001';
const ADMIN_USERNAME = 'admin';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  getAllUsers(): User[] {
    const users = this.storageService.getUsers();
    return users.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  getUserById(userId: string): User | null {
    if (!userId) {
      return null;
    }
    const users = this.storageService.getUsers();
    return users.find((u) => u.id === userId) ?? null;
  }

  createUser(input: UserCreateInput): UserResult {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can create users.' };
    }

    const displayName = (input.display_name ?? '').trim();
    const username = (input.username ?? '').trim();
    const password = input.password ?? '';
    const role = input.role ?? 'viewer';

    if (!displayName || !username || !password) {
      return { success: false, error: 'Display name, username, and password are required.' };
    }

    if (displayName.length < 2) {
      return { success: false, error: 'Display name must be at least 2 characters.' };
    }

    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (username.toLowerCase() === ADMIN_USERNAME) {
      return { success: false, error: 'Username already exists.' };
    }

    try {
      const users = this.storageService.getUsers();
      const exists = users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );

      if (exists) {
        return { success: false, error: 'Username already exists.' };
      }

      const newUser: User = {
        id: this.generateUUID(),
        display_name: displayName,
        username: username,
        password: password,
        role: role,
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      this.storageService.saveUsers(users);
      return { success: true, user: newUser };
    } catch {
      return { success: false, error: 'An error occurred while creating the user. Please try again.' };
    }
  }

  deleteUser(userId: string): UserDeleteResult {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can delete users.' };
    }

    if (!userId) {
      return { success: false, error: 'User ID is required.' };
    }

    if (userId === ADMIN_USER_ID) {
      return { success: false, error: 'Cannot delete the admin user.' };
    }

    if (userId === currentUser.user_id) {
      return { success: false, error: 'Cannot delete your own account.' };
    }

    try {
      const users = this.storageService.getUsers();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return { success: false, error: 'User not found.' };
      }

      users.splice(userIndex, 1);
      this.storageService.saveUsers(users);
      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred while deleting the user. Please try again.' };
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}