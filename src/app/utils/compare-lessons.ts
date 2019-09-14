import { FullLesson } from '../models/schedule-models';

export function compareLessons(...lessons: FullLesson[]) {
    const lesson = lessons[1];
    return lessons.every(l => l.name === lesson.name && l.timeRange === lesson.timeRange && l.week === lesson.week);
}
