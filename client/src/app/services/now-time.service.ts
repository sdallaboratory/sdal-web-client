import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WeekInfo } from '../models/schedule-models';
import { repeatWhen } from 'rxjs/operators';
import { interval } from 'rxjs/internal/observable/interval';
import { getDayFromNuber as getDayFromNumer, DayNumber } from '../utils/day-from-number';

@Injectable({
  providedIn: 'root'
})
export class NowTimeService {

  public currentWeek!: WeekInfo;

  public today!: string;

  constructor(
    private readonly api: ApiService,
  ) { }

  public async init() {
    this.setThisDay();
    setInterval(() => this.setThisDay(), 1000 * 60);

    // TODO: Calculate week offline
    const storedWeekString = localStorage.getItem('touch:week');
    const { timestamp, week } = storedWeekString && JSON.parse(storedWeekString) || {};
    this.currentWeek = week || await this.api.getCurrentWeek().toPromise();
    localStorage.setItem('touch:week', JSON.stringify({
      timestamp: new Date(),
      week: this.currentWeek,
    }));

    this.api.getCurrentWeek().pipe(
      repeatWhen(() => interval(1000 * 60 * 60)),
    ).subscribe(week => {
      this.currentWeek = week;
    });

    // if (!location.hash) {
    //   const hash = `#${this.currentWeek}-${this.today}`;
    //   window.location.hash = hash;
    // }
  }



  setThisDay() {
    this.today = getDayFromNumer(new Date().getDay() as DayNumber);
  }
}
