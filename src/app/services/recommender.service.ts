import { Injectable } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { CombinedDaySchedule, FullLesson, Lesson, ScheduleTimeSlot, CombinedWeekSchedule } from '../models/schedule-models';
import { map, tap, combineLatest } from 'rxjs/operators';
import _ from 'lodash';
import { Option, ScoredOption } from '../models/recommendations-models';
import { getCampus } from '../utils/get-campus';
import { LessonNumberPipe } from '../pipes/lesson-number.pipe';
import { enumerate } from '../utils/lang/enumerate';
import { randomElement } from '../utils/random-element';
import { NowTimeService } from './now-time.service';
import { WeekPipe } from '../pipes/week.pipe';
import { Subject } from 'rxjs';
import { TargetsService } from './targets.service';

@Injectable({
  providedIn: 'root'
})
export class RecommenderService {

  constructor(
    private readonly schedule: ScheduleService,
    private readonly nowTime: NowTimeService,
    private readonly targets: TargetsService,
  ) {
    this.schedule.combinedSchedule.subscribe(async s => setTimeout(() => this.combinedSchedule.next(s)));
  }

  public readonly combinedSchedule = new Subject<CombinedWeekSchedule[] | null>();

  private readonly daysOrder = new Map<string, number>([
    ['пн', 1],
    ['вт', 2],
    ['ср', 3],
    ['чт', 4],
    ['пт', 5],
    ['сб', 6],
  ]);

  public readonly options = this.combinedSchedule.pipe(
    map(s => s || []),
    tap(a => console.log(a)),
    combineLatest(this.targets.targetsObservable),
    map(([s, targets]) => targets && targets.length <= 1 ? [] : s),
    map(s => _.flatten(s.map(d => d.days))),
    map(days => days.filter(day => !this.isPassed(day))),
    map(days => _.flatten(days.map(this.buildOptions.bind(this)))),
    map(options => options.map(o => this.scoreOption(o))),
    map(options => options.filter(o => o.score > 0)),
    map(options => _.orderBy(options, o => -o.score)),
    map(options => options.length ? options : null),
  );

  daysCase = {
    пн: 'в понедельник',
    вт: 'во вторник',
    ср: 'в среду',
    чт: 'в четверг',
    пт: 'в пятницу',
    сб: 'в субботу',
    вс: 'в воскресение',
  } as { [day: string]: string };

  private isPassed(day: CombinedDaySchedule) {
    const week = day.timeSlots[0].groupsLessons[0].week;
    const dayOrder = this.daysOrder.get(day.dayName) || 0;
    const todayOrder = this.daysOrder.get(this.nowTime.today) || 0;
    return false;
    return week === this.nowTime.currentWeek.weekName && dayOrder < todayOrder;
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
    if (this.nowTime.currentWeek.weekName !== option.week) {
      score -= 20;
    }

    const scored: ScoredOption = { ...option, score };

    return scored;
  }

  public verbalize(option: Option, full?: boolean) {
    const terms: string[] = [];
    terms.push(randomElement([
      'Устройте встречу',
      'Договоритесь о встрече',
      'Подходящее время для встречи',
      'Можно встретиться',
    ]));

    // TODO: на этой неделе, на следующей неделе.
    terms.push(`${this.daysCase[option.day]} на ${option.week === this.nowTime.currentWeek.weekName ? 'этой' : 'следующей'} неделе`);

    switch (option.type) {
      case 'before':
        terms.push(`перед ${option.nearestLessonAfterNumber} парой`);
        break;
      case 'after':
        terms.push(`после ${option.nearestLessonBeforeNumber} пары`);
        break;
      case 'mixed':
        terms.push(`между ${option.nearestLessonBeforeNumber} и ${option.nearestLessonAfterNumber} парами`);
        break;
      case 'free':
        terms.push(`в любое время, так как в этот день ни у кого нет пар`);
        break;
    }
    terms.push('.');

    if (option.sameClassroomBefore) {
      terms.push('Очень удобное время, так последняя пара у вас - общая');
    } else if (option.sameCampusBefore) {
      terms.push(`Занятия у вас заканчиваются в одном корпусе - ${option.sameCampusBefore}.`);
    }

    if (option.sameClassroomAfter) {
      terms.push('Первая после встречи пара у вас общая. Можете пойти туда вместе');
    } else if (option.sameCampusAfter) {
      terms.push(`Занятия как раз начинаются в одном корпусе - ${option.sameCampusAfter}.`);
    }

    if (option.militaryDayGroups && option.militaryDayGroups.length) {
      terms.push(`У ребят из ${enumerate(...option.militaryDayGroups)} военка ${this.daysCase[option.day]}, что не очень удобно.`);
    }

    if (option.peDayGroups && option.peDayGroups.length) {
      terms.push(`У ${enumerate(...option.peDayGroups)} в этот день физра, придётся таскаться с формой`);
    }

    if (option.freeDayGroups && option.freeDayGroups.length) {
      terms.push(`Учтите, что групп${option.freeDayGroups.length === 1 ? 'ы' : ''}`);
      terms.push(`${enumerate(...option.freeDayGroups)} в этот день нет пар`);
    }

    return terms.join(' ').replace(' .', '.');
  }
}
