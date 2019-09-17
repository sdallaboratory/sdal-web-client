import { FullLesson } from './schedule-models';

export interface LessonsMap {
    [group: string]: FullLesson;
}
export interface Option {
    week: string;
    day: string;
    type: 'before' | 'after' | 'mixed';
    lessonsBefore: LessonsMap;
    nearestLessonBeforeNumber?: number;
    lessonsAfter: LessonsMap;
    nearestLessonAfterNumber?: number;
    militaryDayGroups?: string[];
    peDayGroups?: string[];
    freeDayGroups?: string[];
    sameCampus: boolean;
    sameClassroom: boolean;
    timeOfDay: 'morning' | 'day' | 'evening';

    // deprecated
    lessons: (FullLesson | null)[];
    firstLessonNumber?: number;
    lastLessonNumber?: number;
    maxLessonsWait: number;
}

export interface ScoredOption extends Option {
    score: number;
}
