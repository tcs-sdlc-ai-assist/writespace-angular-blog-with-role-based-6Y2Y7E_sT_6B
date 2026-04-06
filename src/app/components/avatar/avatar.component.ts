import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService } from '@app/services/avatar.service';
import type { UserRole, AvatarConfig } from '@app/models/user.model';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar-container"
      [ngClass]="'avatar-' + size"
      [style.backgroundColor]="config.color"
      [attr.aria-label]="displayName ? displayName + ' (' + role + ')' : role + ' avatar'"
      role="img"
    >
      <span class="avatar-emoji">{{ config.emoji }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .avatar-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full, 9999px);
      overflow: hidden;
      flex-shrink: 0;
      color: var(--color-text-inverse, #ffffff);
      font-weight: var(--font-weight-semibold, 600);
      user-select: none;
    }

    .avatar-sm {
      width: 2rem;
      height: 2rem;
    }

    .avatar-sm .avatar-emoji {
      font-size: 0.875rem;
    }

    .avatar-md {
      width: 2.5rem;
      height: 2.5rem;
    }

    .avatar-md .avatar-emoji {
      font-size: 1.125rem;
    }

    .avatar-lg {
      width: 3.5rem;
      height: 3.5rem;
    }

    .avatar-lg .avatar-emoji {
      font-size: 1.5rem;
    }

    .avatar-emoji {
      line-height: 1;
    }
  `],
})
export class AvatarComponent {
  @Input() role: UserRole = 'viewer';
  @Input() displayName: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  config: AvatarConfig = { emoji: '📖', color: '#6366f1' };

  private avatarService: AvatarService;

  constructor(avatarService: AvatarService) {
    this.avatarService = avatarService;
  }

  ngOnChanges(): void {
    this.updateConfig();
  }

  ngOnInit(): void {
    this.updateConfig();
  }

  private updateConfig(): void {
    try {
      this.config = this.avatarService.getAvatarConfig(this.role);
    } catch {
      this.config = { emoji: '❓', color: '#94a3b8' };
    }
  }
}