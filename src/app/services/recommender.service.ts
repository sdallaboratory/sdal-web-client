import { Injectable } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { CombinedDaySchedule, FullLesson, Lesson, ScheduleTimeSlot } from '../models/schedule-models';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import { Option, ScoredOption } from '../models/recommendations-models';
import { getCampus } from '../utils/get-campus';

@Injectable({
  providedIn: 'root'
})
export class RecommenderService {

  constructor(
    private readonly schedule: ScheduleService
  ) { }

  public readonly options = this.schedule.combinedSchedule.pipe(
    map(s => s || []),
    map(s => _.flatten(s.map(d => d.days))),
    map(days => _.flatten(days.map(this.buildOptions.bind(this)))),
    map(options => options.map(o => this.scoreOption(o))),
    map(options => _.orderBy(options, o => -o.score)),
    map(options => options.length ? options : null),
  );

  private isSlotFree(slot: ScheduleTimeSlot) {
    return slot.groupsLessons.every(l => !l.name);
  }

  isMilitary(lessonName: string) {
    const normalized = lessonName.split('/').join('').toLowerCase();
    return normalized.includes('военная подготовка')
      || normalized === 'вп';
  }

  isPe(lessonName: string) {
    const normalized = lessonName.split('/').join('').toLowerCase();
    return normalized.includes('физкультура')
      || normalized === 'спорт'
      || normalized === 'валеология'
      || normalized === 'физическая культура'
  }

  private getLessonsBefore() {

  }



  private buildOptions({ dayName, timeSlots }: CombinedDaySchedule) {
    const options: Option[] = [];

    for (const slotToTest of timeSlots) {
      if (!this.isSlotFree(slotToTest)) {
        continue;
      }

      const { week, day, timeRange, lessonNumber } = slotToTest.groupsLessons[0];

      const flatten = _.flatten(timeSlots.map(s => s.groupsLessons));

      const militaryDayGroups: string[] = [];
      const peDayGroups: string[] = [];
      for (const { name, group } of flatten) {
        if (!name) {
          continue;
        }
        if (this.isMilitary(name) && militaryDayGroups.includes(group)) {
          militaryDayGroups.push(group);
        }
        if (this.isPe(name) && militaryDayGroups.includes(group)) {
          peDayGroups.push(group);
        }
      }

      const freeDayGroups: string[] = [];

      // const lessonsBefore: FullLesson[] = [];
      const lessonsAfter: FullLesson[] = [];

      const lessonsBefore = flatten.filter(l => l.name).filter(l => l.lessonNumber < lessonNumber);

      for (const slot of timeSlots) {
        for (const lesson of slot.groupsLessons) {
          // if 
        }
      }

      const option = {

      } as Option;

      // options.push(option);
    }

    return options;
  }
  // private buildOptions(daySchedule: CombinedDaySchedule) {


  //   const freeDayGroups: string[] = [];
  //   const militaryDayGroups: string[] = [];
  //   const peDayGroups: string[] = [];

  //   for (const group in byGroups) {
  //     if (byGroups.hasOwnProperty(group)) {
  //       const lessons = byGroups[group];

  //       if (lessons.some(l => !!l.name
  //         && (l.name.toLowerCase().includes('военная подготовка')
  //           || l.name.includes('ВП')
  //           || l.name.includes('В/П')))) {
  //         militaryDayGroups.push(group);
  //       }

  //       if (lessons.every(l => !l.name)) {
  //         freeDayGroups.push(group);
  //       }
  //     }
  //   }

  //   const firsts: { [group: string]: FullLesson } = {};
  //   const lasts: { [group: string]: FullLesson } = {};

  //   for (const slot of daySchedule.timeSlots) {
  //     for (const lesson of slot.groupsLessons) {
  //       const group = lesson.group;
  //       if (!lesson.name) {
  //         continue; // NOT BREAK
  //       }
  //       lasts[group] = (lesson);
  //       if (!Object.keys(firsts).includes(group)) {
  //         firsts[group] = lesson;
  //       }
  //     }
  //   }

  //   const options = [];

  //   const lessons = [...Object.values(lasts)];

  //   const lessonsNumbers = lessons.map(l => l.lessonNumber);
  //   const locations = lessons.map(l => ({ ...l, location: l.location && l.location.replace('каф', '') } as Lesson))
  //     .filter(l => l.location)
  //     .map(l => l.location);
  //   // TODO: Handle same 'каф'
  //   const sameCampus = locations.length === lessons.length && new Set(locations.map(l => getCampus(l!))).size === 1;
  //   const sameClassroom = sameCampus && new Set(locations).size === 1;

  //   const firstLessonNumber = _.min(lessonsNumbers);
  //   const lastLessonNumber = _.min(lessonsNumbers);

  //   const afterOption: Option = {
  //     week: daySchedule.dayName
  //     type: 'after',
  //     maxLessonsWait: (lastLessonNumber || 0) - (firstLessonNumber || 0),
  //     militaryDayGroups,
  //     freeDayGroups,
  //     lessons,
  //     sameCampus,
  //     sameClassroom,
  //     peDayGroups: [],
  //     firstLessonNumber,
  //     lastLessonNumber,
  //   };

  //   return [afterOption] as Option[];
  // }

  private scoreOption(option: Option) {
    let score = 0;

    if (option.type === 'after') {
      score += 30;
    } else if (option.type === 'before') {
      score += 15;
    } else if (option.type === 'mixed') {
      score += 10;
    }

    score -= option.maxLessonsWait * 5;
    score -= (option.militaryDayGroups || []).length * 5;
    score -= (option.freeDayGroups || []).length * 10;
    score -= (option.peDayGroups || []).length * 2;

    if (option.sameCampus) {
      score += 5;
    }

    if (option.sameClassroom) {
      score += 10;
    }


    const scored: ScoredOption = { ...option, score };
    return scored;
  }

  public verbalize(option: Option, full?: boolean) {
    const terms: string[] = [];
    terms.push('Встретиться');
    if (option.type === 'after') {
      terms.push('после');
      terms.push(`${option.lastLessonNumber}`);
      terms.push('пары');
    } else if (option.type === 'before') {
      terms.push('перед');
      terms.push(`${option.firstLessonNumber}`);
      terms.push('парой');
    }
    const lesson = option.lessons[0];
    if (lesson) {
      terms.push('в');
      terms.push(`${lesson.day}`);
      terms.push('на');
      terms.push(`${lesson.week.toLocaleLowerCase().replace('ь', 'е')}`);
      terms.push('.');
    }
    return terms.join(' ');
  }
}
