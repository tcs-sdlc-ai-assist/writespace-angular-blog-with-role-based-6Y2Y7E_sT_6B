import { Injectable } from '@angular/core';
import type { Post } from '@app/models/post.model';
import type { User, Session } from '@app/models/user.model';

const STORAGE_KEYS = {
  POSTS: 'posts',
  USERS: 'users',
  CURRENT_USER: 'currentUser',
} as const;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getPosts(): Post[] {
    return this.getItem<Post[]>(STORAGE_KEYS.POSTS) ?? [];
  }

  savePosts(posts: Post[]): void {
    this.setItem(STORAGE_KEYS.POSTS, posts);
  }

  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS) ?? [];
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getSession(): Session | null {
    return this.getItem<Session>(STORAGE_KEYS.CURRENT_USER);
  }

  getCurrentUser(): Session | null {
    return this.getSession();
  }

  saveSession(session: Session): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, session);
  }

  clearSession(): void {
    this.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  private getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return null;
      }
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — silently fail
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable — silently fail
    }
  }
}