
export interface Lesson {
    timeRange: string;
    name: string | null;
    teacher?: string;
    location?: string;
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

// Frontend models

export interface FlatLesson extends Lesson {
    group: string;
    color: string;
    week: 'enumerator' | 'denominator';
    day: string;
}

export interface GroupLesson {
    group: string;
    color: string;
    name: string | null;
    teacher?: string;
    location?: string;
}

export interface ScheduleTimeSlot {
    timeRange: string;
    groupsLessons: GroupLesson[];
}

export interface CombinedDaySchedule {
    dayName: string | 'ПН';
    timeSlots: ScheduleTimeSlot[];
}

export interface CombinedWeekSchedule {
    weekName: 'enumerator' | 'denominator';
    days: CombinedDaySchedule[];
}
