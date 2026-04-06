import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [style.borderTopColor]="color">
      <div class="stat-header">
        <span class="stat-icon">{{ icon }}</span>
        <span class="stat-title">{{ title }}</span>
      </div>
      <div class="stat-value">{{ value }}</div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .stat-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      border-top: 4px solid var(--color-primary);
      padding: var(--spacing-6);
      transition: box-shadow var(--transition-base), transform var(--transition-base);
    }

    .stat-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-3);
    }

    .stat-icon {
      font-size: var(--font-size-xl);
      line-height: 1;
    }

    .stat-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
    }

    .stat-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
    }
  `],
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() icon: string = '📊';
  @Input() color: string = 'var(--color-primary)';
}