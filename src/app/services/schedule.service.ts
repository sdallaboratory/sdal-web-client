import { Injectable } from '@angular/core';
import { TargetsService } from './targets.service';
import { switchMap, map, filter } from 'rxjs/operators';
import { GroupSchedule, FullLesson, ScheduleTimeSlot, CombinedDaySchedule, CombinedWeekSchedule } from '../models/schedule-models';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { LessonNumberPipe } from '../pipes/lesson-number.pipe';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public readonly selectedLesson = new BehaviorSubject<FullLesson | null>(null);

  constructor(
    private readonly targets: TargetsService,
    private readonly pipe: LessonNumberPipe
  ) {
    targets.targetsObservable.pipe(
      filter(ts => !ts || this.selectedLesson.value && !ts.map(t => t.group).includes(this.selectedLesson.value.group) || false)
    ).subscribe(() => this.selectedLesson.next(null));
    console.log(pipe);
  }

  public readonly combinedSchedule = this.targets.targetsObservable.pipe(
    map(targets => targets || []),
    switchMap(targets => Promise.all(targets.map(t => t.schedulePromise))),
    map(this.flattenSchdeule.bind(this)),
    map(lessons => lessons.map(
      l => ({ ...l, name: l.name && l.name.replace('СР', '').replace('Самостоятельная работа', '') } as FullLesson)
    )),
    map(this.combineSchedules),
  );

  private flattenSchdeule(schedules: GroupSchedule[]) {
    const materialColors = [
      '#DAF7A655',
      '#FFC30055',
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
          ...l, group, day, week: 'Числитель', color: materialColors[i],
          lessonNumber: this.pipe.transform(l.timeRange)
        } as FullLesson)),
        ...denominator.map(l => ({
          ...l, group, day, week: 'Знаменатель', color: materialColors[i],
          lessonNumber: this.pipe.transform(l.timeRange)
        } as FullLesson)),
      ]))
    );
    console.log(flatLessons);
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
    console.log(schedule);

    return schedule;
  }
}
