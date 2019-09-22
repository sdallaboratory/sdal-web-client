import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WeekInfo } from '../models/schedule-models';
import { repeatWhen } from 'rxjs/operators';
import { interval } from 'rxjs/internal/observable/interval';
import { getDayFromNuber, DayNumber } from '../utils/day-from-number';

@Injectable({
  providedIn: 'root'
})
export class NowTimeService {

  public currentWeek: WeekInfo = {
    number: 2,
    weekName: 'знаменатель',
  };

  public today!: string;

  constructor(
    private readonly api: ApiService,
  ) { }

  public async init() {

    setInterval(() => this.setThisDay(), 1000 * 60);

    // this.currentWeek = await this.api.getCurrentWeek().toPromise();
    // this.api.getCurrentWeek().pipe(
    //   repeatWhen(() => interval(1000 * 60 * 60)),
    // ).subscribe(week => {
    //   this.currentWeek = week;
    // });
  }

  setThisDay() {
    this.today = getDayFromNuber(new Date().getDay() as DayNumber);
  }
}
