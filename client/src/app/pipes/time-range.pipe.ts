import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeRange'
})
export class TimeRangePipe implements PipeTransform {

  transform(timeRange: string, part: 'start' | 'finish'): any {
    return timeRange.split(' - ')[part === 'start' ? 0 : 1];
  }

}
