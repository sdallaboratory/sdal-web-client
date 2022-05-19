
export interface Lesson {
    timeRange: string;
    name: string | null;
    teacher?: string;
    location?: string;
    type: string;
}

export interface DaySchedule {
    name: string | 'ПН';
    numerator: Lesson[];
    denominator: Lesson[];
}

export interface GroupSchedule {
    name: string;
    days: DaySchedule[];
}

export interface WeekInfo {
    number: number;
    weekName: string;
}

// Frontend models

export interface FullLesson extends Lesson {
    lessonNumber: number;
    group: string;
    color: string;
    week: 'числитель' | 'знаменатель';
    day: string;
}

export interface ScheduleTimeSlot {
    timeRange: string;
    groupsLessons: FullLesson[];
}

export interface CombinedDaySchedule {
    dayName: string | 'ПН';
    timeSlots: ScheduleTimeSlot[];
}

export interface CombinedWeekSchedule {
    weekName: 'числитель' | 'знаменатель';
    days: CombinedDaySchedule[];
}
