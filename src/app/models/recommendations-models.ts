import { FullLesson } from './schedule-models';

export interface Option {
    lessons: (FullLesson | null)[];
    firstLessonNumber?: number;
    lastLessonNumber?: number;
    freeDayGroups: string[];
    militaryDayGroups: string[];
    peDayGroups: string[];
    sameCampus: boolean;
    sameClassroom: boolean;
    maxLessonsWait: number;
    order: 'before' | 'after' | 'mixed';
}

export interface ScoredOption extends Option {
    score: number;
}
