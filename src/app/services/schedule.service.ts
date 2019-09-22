import { Injectable } from '@angular/core';
import { TargetsService } from './targets.service';
import { switchMap, map, filter, repeatWhen } from 'rxjs/operators';
import {
  GroupSchedule,
  FullLesson,
  ScheduleTimeSlot,
  CombinedDaySchedule,
  CombinedWeekSchedule,
  WeekInfo
} from '../models/schedule-models';
import _ from 'lodash';
import { BehaviorSubject, interval } from 'rxjs';
import { LessonNumberPipe } from '../pipes/lesson-number.pipe';
import { ApiService } from './api.service';
import { NowTimeService } from './now-time.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public readonly selectedLesson = new BehaviorSubject<FullLesson | null>(null);

  constructor(
    private readonly targets: TargetsService,
    private readonly pipe: LessonNumberPipe,
    private readonly nowTime: NowTimeService,
  ) {
    targets.targetsObservable.pipe(
      filter(ts => !ts || this.selectedLesson.value && !ts.map(t => t.group).includes(this.selectedLesson.value.group) || false)
    ).subscribe(() => this.selectedLesson.next(null));
  }

  public readonly combinedSchedule = this.targets.targetsObservable.pipe(
    map(targets => targets || []),
    switchMap(targets => Promise.all(targets.map(t => t.schedulePromise))),
    map(this.flattenSchdeule.bind(this)),
    map(lessons => lessons.map(
      l => ({ ...l, name: l.name && l.name.replace('СР', '').replace('Самостоятельная работа', '') } as FullLesson)
    )),
    map(this.combineSchedules),
    map(schedule => schedule && _.orderBy(schedule, s => s.weekName !== this.nowTime.currentWeek.weekName)),
  );

  private flattenSchdeule(schedules: GroupSchedule[]) {

    const materialColors = [
      '#16D1FF55',
      '#CC1CFF55',
      '#B388FF55',
      '#536DFE55',
      '#64FFDA55',
      '#DAF7A655',
      '#FFC30055',
      '#B388FF55',
      '#536DFE55',
      '#64FFDA55',
      '#16D1FF55',
      '#CC1CFF55',
      '#B388FF55',
      '#536DFE55',
      '#64FFDA55',
      '#DAF7A655',
      '#FFC30055',
      '#B388FF55',
      '#536DFE55',
      '#64FFDA55',
    ];

    const flatLessons: FullLesson[] = _.flattenDeep(
      schedules.map(({ name: group, days, }, i) => days.map(({ name: day, numerator, denominator }) => [
        ...numerator.map(l => ({
          ...l, group, day, week: 'числитель', color: materialColors[i],
          lessonNumber: this.pipe.transform(l.timeRange)
        } as FullLesson)),
        ...denominator.map(l => ({
          ...l, group, day, week: 'знаменатель', color: materialColors[i],
          lessonNumber: this.pipe.transform(l.timeRange)
        } as FullLesson)),
      ]))
    );
    return flatLessons;
  }

  private combineSchedules(flatLessons: FullLesson[]) {

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

    return schedule.length ? schedule : null;
  }
}
