import { Pipe, PipeTransform } from '@angular/core';
import { FullLesson } from '../models/schedule-models';

@Pipe({
  name: 'lessonTooltip'
})
export class LessonTooltipPipe implements PipeTransform {

  transform(lesson: FullLesson): any {
    const parts = [lesson.type, lesson.name, lesson.location, lesson.teacher];
    return parts.join(' ');
  }

}
