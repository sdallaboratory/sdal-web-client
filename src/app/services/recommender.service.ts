import { Injectable } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { CombinedDaySchedule } from '../models/schedule-models';
import { map } from 'rxjs/operators';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RecommenderService {

  constructor(
    private readonly schedule: ScheduleService
  ) { }

  public readonly recommendations = this.schedule.combinedSchedule.pipe(
    map(s => _.flattenDeep(s.schedule)),
    // map()
  );

  private makeDayRecommendations(daySchedul: CombinedDaySchedule) {

  }
}
