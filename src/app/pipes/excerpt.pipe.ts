import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt',
  standalone: true,
})
export class ExcerptPipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength: number = 150): string {
    if (!value) {
      return '';
    }

    if (value.length <= maxLength) {
      return value;
    }

    return value.substring(0, maxLength).trimEnd() + '…';
  }
}