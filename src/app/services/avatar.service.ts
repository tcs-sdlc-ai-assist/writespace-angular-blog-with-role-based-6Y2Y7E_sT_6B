import { Injectable } from '@angular/core';
import type { UserRole, AvatarConfig } from '@app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly avatarConfigs: Record<UserRole, AvatarConfig> = {
    admin: {
      emoji: '👑',
      color: '#8b5cf6',
    },
    viewer: {
      emoji: '📖',
      color: '#6366f1',
    },
  };

  getAvatarConfig(role: UserRole): AvatarConfig {
    const config = this.avatarConfigs[role];
    if (!config) {
      throw new Error(`Unknown user role: ${role}`);
    }
    return config;
  }
}