import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TargetsService } from './targets.service';
import { mergeMap, switchMap, map, tap } from 'rxjs/operators';
import { GroupSchedule, FlatLesson, ScheduleTimeSlot, CombinedDaySchedule, CombinedWeekSchedule } from '../models/schedule-models';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    private readonly targets: TargetsService,
  ) { }

  public readonly combinedSchedule = this.targets.targetsObservable.pipe(
    map(targets => targets || []),
    switchMap(targets => Promise.all(targets.map(t => t.schedulePromise))),
    map(this.combineSchedules),
  ).subscribe(targets => console.log(targets));

  private combineSchedules(schedules: GroupSchedule[]) {
    const materialColors = [
      '#DAF7A655',
      '#FFC30055',
      '#B388FF55',
      '#536DFE55',
      '#64FFDA55',
    ];

    const flatLessons: FlatLesson[] = _.flattenDeep(
      schedules.map(({ name: group, days }, i) => days.map(({ name: day, numerator, denominator }) => [
        ...numerator.map(l => ({ ...l, group, day, week: 'Числитель', color: materialColors[i] })),
        ...denominator.map(l => ({ ...l, group, day, week: 'Знаменатель', color: materialColors[i] })),
      ]))
    );

    const schedule = Object.entries(_.groupBy(flatLessons, l => l.week)).map(([weekName, lessonsOfWeek]) => ({
      weekName,
      days: Object.entries(_.groupBy(lessonsOfWeek, l => l.day)).map(([dayName, lessonsOfDay]) => ({
        dayName,
        timeSlots: Object.entries(_.groupBy(lessonsOfDay, l => l.timeRange)).map(([timeRange, lessonsOfSlot]) => ({
          timeRange,
          groupsLessons: lessonsOfSlot
        } as ScheduleTimeSlot)),
      } as CombinedDaySchedule)),
    } as CombinedWeekSchedule));
    console.log(schedule);

    const groups = schedules.map(s => s.name);

    return { groups, schedule };
  }
}
