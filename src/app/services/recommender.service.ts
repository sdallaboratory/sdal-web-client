import { Injectable } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { CombinedDaySchedule, FullLesson } from '../models/schedule-models';
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

  public readonly recommendations = this.schedule.combinedSchedule.pipe(
    map(s => _.flatten(s.map(d => d.days))),
    map(days => _.flatten(days.map(this.buildOptions))),
    map(options => options.map(o => this.scoreOption(o))),
  );

  private buildOptions(daySchedule: CombinedDaySchedule) {

    const byGroups = _.groupBy(_.flatten(daySchedule.timeSlots.map(s => s.groupsLessons)), l => l.group);
    const groups = Object.keys(byGroups);

    const freeDayGroups: string[] = [];
    const militaryDayGroups: string[] = [];

    for (const group in byGroups) {
      if (byGroups.hasOwnProperty(group)) {
        const lessons = byGroups[group];

        if (lessons.some(l => !!l.name
          && (l.name.toLowerCase().includes('военная подготовка')
            || l.name.includes('ВП')))) {
          militaryDayGroups.push(group);
        }

        if (lessons.every(l => !l.name)) {
          freeDayGroups.push(group);
        }
      }
    }

    const firsts: { [group: string]: FullLesson } = {};
    const lasts: { [group: string]: FullLesson } = {};

    for (const slot of daySchedule.timeSlots) {
      for (const lesson of slot.groupsLessons) {
        const group = lesson.group;
        if (!lesson.name) {
          break;
        }
        lasts[group] = (lesson);
        if (!Object.keys(firsts).includes(group)) {
          firsts[group] = lesson;
        }
      }
    }

    const options = [];

    const lessons = [...Object.values(lasts)];
    const lessonsNumbers = lessons.map(l => l.lessonNumber);
    const locations = lessons.filter(l => l.location).map(l => l.location);
    // TODO: Handle same 'каф'
    const sameCampus = locations.length === lessons.length && new Set(locations.map(l => getCampus(l!))).size === 1;
    const sameClassroom = sameCampus && new Set(locations).size === 1;

    // console.log(lessonsNumbers);
    const firstLessonNumber = _.min(lessonsNumbers);
    const lastLessonNumber = _.min(lessonsNumbers);

    const afterOption: Option = {
      order: 'after',
      maxLessonsWait: (lastLessonNumber || 0) - (firstLessonNumber || 0),
      militaryDayGroups,
      freeDayGroups,
      lessons,
      sameCampus,
      sameClassroom,
      peDayGroups: [],
      firstLessonNumber,
      lastLessonNumber,
    };

    return [afterOption] as Option[];
  }

  private scoreOption(option: Option) {
    let score = 0;

    if (option.order === 'after') {
      score += 30;
    } else if (option.order === 'before') {
      score += 15;
    } else if (option.order === 'mixed') {
      score += 10;
    }

    score -= option.maxLessonsWait * 5;
    score -= option.militaryDayGroups.length * 5;
    score -= option.freeDayGroups.length * 10;
    score -= option.peDayGroups.length * 2;

    if (option.sameCampus) {
      score += 5;
    }

    if (option.sameClassroom) {
      score += 10;
    }


    const scored: ScoredOption = { ...option, score };
    return scored;
  }
}
