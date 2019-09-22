import { Pipe, PipeTransform } from '@angular/core';
import { NowTimeService } from '../services/now-time.service';

@Pipe({
  name: 'week'
})
export class WeekPipe implements PipeTransform {

  constructor(
    private readonly nowTime: NowTimeService,
  ) { }

  transform(weekName: 'знаменатель' | 'числитель'): any {
    return this.nowTime.currentWeek.weekName === weekName ? 'эта неделя' : 'следующая неделя';
  }

}
