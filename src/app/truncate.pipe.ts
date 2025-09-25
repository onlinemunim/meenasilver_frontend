import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number = 200): string {
    if (!value) return '';
    return value.length > length ? value.substring(0, length) + '......' : value;
  }
}
