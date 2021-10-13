import { CombinedWeekSchedule, FullLesson } from './schedule-models';

export interface LessonsMap {
    [group: string]: FullLesson;
}
export interface Option {
    week: string;
    day: string;
    type: 'before' | 'after' | 'mixed' | 'free';
    lessonsBefore: LessonsMap;
    nearestLessonBeforeNumber?: number;
    lessonsAfter: LessonsMap;
    nearestLessonAfterNumber?: number;
    militaryDayGroups?: string[];
    peDayGroups?: string[];
    freeDayGroups?: string[];
    sameCampusBefore?: string;
    sameCampusAfter?: string;
    sameClassroomBefore: string;
    sameClassroomAfter: string;
    totalWaitLessons: number;

    timeRange: string;
    // timeOfDay: 'morning' | 'day' | 'evening';

    // deprecated
    // lessons: (FullLesson | null)[];
    // firstLessonNumber?: number;
    // lastLessonNumber?: number;
    // maxLessonsWait: number;
}

export interface ScoredOption extends Option {
    score: number;
}

export interface RecommenderWorkerData {
    today: string;
    currentWeekName: string;
    schedules: CombinedWeekSchedule[];
}

