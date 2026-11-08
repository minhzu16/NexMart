import { Pipe, PipeTransform } from '@angular/core';

/**
 * Currency VND Pure Pipe - UI UX Pro Max & Addy Osmani Agent Skills
 * Pure pipe ensures transformation only re-runs when the primitive value changes,
 * preventing template function execution loops under Zone.js dirty checking.
 */
@Pipe({
  name: 'currencyVnd',
  standalone: true,
  pure: true
})
export class CurrencyVndPipe implements PipeTransform {
  private formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0 ₫';
    }
    return this.formatter.format(value);
  }
}

