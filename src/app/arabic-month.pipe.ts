import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicMonth'
})
export class ArabicMonthPipe implements PipeTransform {

  private months: string[] = [
    'يناير', // 1
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
  ];
  transform(value: any, args?: any): any {
    if (value >= 1 && value <= 12) {
      return this.months[value - 1];
    }
    return 'شهر غير معروف'; // fallback
  
  }

}
