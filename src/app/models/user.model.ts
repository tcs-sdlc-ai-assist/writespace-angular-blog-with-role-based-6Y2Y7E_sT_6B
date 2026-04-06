export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  display_name: string;
  username: string;
  password: string;
  role: UserRole;
  created_at: string;
}

export interface Session {
  user_id: string;
  username: string;
  display_name: string;
  role: UserRole;
}

export type CurrentUser = Session;

export interface AvatarConfig {
  emoji: string;
  color: string;
}