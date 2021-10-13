/// <reference lib="webworker" />

import _ from 'lodash';
import { DoWork, runWorker } from 'observable-webworker';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CombinedDaySchedule, FullLesson, ScheduleTimeSlot } from '../models/schedule-models';
import { Option, ScoredOption, RecommenderWorkerData } from '../models/recommendations-models';
import { getCampus } from '../utils/get-campus';

export class OptionsWorker implements DoWork<RecommenderWorkerData, ScoredOption[] | null> {

  private currentWeekName: string = '';
  private today: string = '';

  public work(input$: Observable<RecommenderWorkerData>): Observable<ScoredOption[] | null> {
    return input$.pipe(
      map(data => {
        this.currentWeekName = data.currentWeekName;
        this.today = data.today;
        return data.schedules;
      }),
      map(s => _.flatten(s.map(d => d.days))),
      map(days => days.filter(day => !this.isPassed(day))),
      map(days => _.flatten(days.map(this.buildOptions.bind(this)))),
      map(options => options.map(o => this.scoreOption(o))),
      map(options => options.filter(o => o.score > 0)),
      map(options => _.orderBy(options, o => -o.score)),
      map(options => options.length ? options : null),
      shareReplay(1),
    )
  }

  private readonly daysOrder = new Map<string, number>([
    ['пн', 1],
    ['вт', 2],
    ['ср', 3],
    ['чт', 4],
    ['пт', 5],
    ['сб', 6],
  ]);
      
  private isPassed(day: CombinedDaySchedule) {
    const week = day.timeSlots[0].groupsLessons[0].week;
    const dayOrder = this.daysOrder.get(day.dayName) || 0;
    const todayOrder = this.daysOrder.get(this.today) || 0;
    // return false;
    return week === this.currentWeekName && dayOrder < todayOrder;
  }

  private isSlotFree(slot: ScheduleTimeSlot | undefined) {
    return !slot || slot.groupsLessons.every(l => !l.name);
  }

  isMilitary(lessonName: string) {
    const normalized = lessonName.split('/').join('').toLowerCase();
    return normalized.includes('военная подготовка')
      || /В\/*П/.test(lessonName)
      || /В\/*К/.test(lessonName);
  }

  isPe(lessonName: string) {
    const normalized = lessonName.split('/').join('').toLowerCase();
    return normalized.includes('физкультура')
      || normalized.includes('спорт')
      || normalized.includes('валеология')
      || normalized.includes('физическая культура');
  }
      
  private getLessonsBefore(timeSlots: ScheduleTimeSlot[], lessonNumber: number) {
    const lessonsBefore = {} as { [group: string]: FullLesson };

    for (let i = 0; i < lessonNumber - 1; i++) {
      const slot = timeSlots[i];
      for (const lesson of slot.groupsLessons) {
        if (lesson.name) {
          lessonsBefore[lesson.group] = lesson;
        }
      }
    }

    return lessonsBefore;
  }

  private getLessonsAfter(timeSlots: ScheduleTimeSlot[], lessonNumber: number) {
    const lessonsAfter = {} as { [group: string]: FullLesson };

    for (let i = 7 - 1; i > lessonNumber - 1; i--) {
      const slot = timeSlots[i];
      for (const lesson of slot.groupsLessons) {
        if (lesson.name) {
          lessonsAfter[lesson.group] = lesson;
        }
      }
    }

    return lessonsAfter;
  }
      
  private buildOptions({ dayName, timeSlots }: CombinedDaySchedule) {
    const options: Option[] = [];

    const flatten = _.flatten(timeSlots.map(s => s.groupsLessons)).filter(l => l.name);
    const groups = timeSlots[0].groupsLessons.map(l => l.group);

    const militaryDayGroups: string[] = [];
    const peDayGroups: string[] = [];

    for (const { name, group } of flatten) {
      if (!name) {
        continue;
      }
      if (this.isMilitary(name) && !militaryDayGroups.includes(group)) {
        militaryDayGroups.push(group);
      }
      if (this.isPe(name) && !militaryDayGroups.includes(group)) {
        peDayGroups.push(group);
      }
    }

    const hasLessons = new Set(flatten.map(l => l.group));
    const freeDayGroups: string[] = groups.filter(g => !hasLessons.has(g));

    for (const slotToTest of timeSlots) {

      const { week, day, timeRange, lessonNumber } = slotToTest.groupsLessons[0];

      const prevSlot = timeSlots[lessonNumber - 1 - 1];
      const nextSlot = timeSlots[lessonNumber + 1 - 1];

      // TODO: Maybe suggest to meet in totally free days;
      if (this.isSlotFree(prevSlot)
        && this.isSlotFree(nextSlot)
        || !this.isSlotFree(slotToTest)) {
        continue;
      }


      // const lessonNumber = this.lessonNumber.transform(slotToTest.timeRange);

      const lessonsBefore = this.getLessonsBefore(timeSlots, lessonNumber);
      const lessonsAfter = this.getLessonsAfter(timeSlots, lessonNumber);

      const locationsBefore = prevSlot && prevSlot.groupsLessons.map(l => l.location).filter(l => l);
      const locationsAfter = nextSlot && nextSlot.groupsLessons.map(l => l.location).filter(l => l);


      const sameCampusBefore = locationsBefore && locationsBefore.length === slotToTest.groupsLessons.length
        && new Set(locationsBefore.map(l => l && getCampus(l))).size === 1 && getCampus(locationsBefore![0]!);

      const sameCampusAfter = locationsAfter && locationsAfter.length === slotToTest.groupsLessons.length
        && new Set(locationsAfter.map(l => l && getCampus(l))).size === 1 && getCampus(locationsAfter![0]!);

      const sameClassroomBefore = sameCampusBefore
        && new Set(locationsBefore).size === 1;

      const sameClassroomAfter = sameCampusAfter
        && new Set(locationsAfter).size === 1;

      const totalWaitTime = [...Object.values(lessonsAfter), ...Object.values(lessonsBefore)]
        .reduce((acc, cur) => acc + Math.abs(cur.lessonNumber - lessonNumber), 0);

      const nearestLessonBefore = _.maxBy(Object.values(lessonsBefore), l => l.lessonNumber);
      const nearestLessonAfter = _.minBy(Object.values(lessonsAfter), l => l.lessonNumber);

      let type = 'free';
      if (nearestLessonAfter && nearestLessonBefore) {
        type = 'mixed';
      } else if (nearestLessonBefore) {
        type = 'after';
      } else if (nearestLessonAfter) {
        type = 'before';
      }

      const option = {
        timeRange,
        week,
        day,
        type,
        lessonsBefore,
        nearestLessonBeforeNumber: nearestLessonBefore && nearestLessonBefore.lessonNumber,
        lessonsAfter,
        nearestLessonAfterNumber: nearestLessonAfter && nearestLessonAfter.lessonNumber,
        militaryDayGroups,
        peDayGroups,
        freeDayGroups,
        sameCampusBefore,
        sameClassroomBefore,
        sameCampusAfter,
        sameClassroomAfter,
        totalWaitLessons: totalWaitTime,
        // timeOfDay: 'morning',
      } as Option;
      options.push(option);
    }
    return options;
  }

  private scoreOption(option: Option) {
    let score = 50;

    if (option.type === 'after') {
      score += 30;
    } else if (option.type === 'before') {
      score += 20;
    } else if (option.type === 'mixed') {
      score += 20;
    } else if (option.type === 'free') {
      score += 10;
    }

    // score -= option.maxLessonsWait * 5;
    score -= option.totalWaitLessons * 6;

    score -= (option.militaryDayGroups || []).length * 5;
    score -= (option.freeDayGroups || []).length * 20;
    score -= (option.peDayGroups || []).length * 2;

    if (option.sameCampusBefore || option.sameCampusAfter) {
      score += 15;
    }

    if (option.sameClassroomBefore || option.sameClassroomAfter) {
      score += 30;
    }

    // TODO: Check if day has gone.
    if (this.currentWeekName !== option.week) {
      score -= 20;
    }

    const scored: ScoredOption = { ...option, score };

    return scored;
  }
  
}

runWorker(OptionsWorker)