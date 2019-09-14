import { Student } from './student';
import { GroupSchedule } from './schedule-models';

export interface StoredTarget {
    group: string;
    students?: Student[];
    color: string;
}

export interface Target extends StoredTarget {
    scheduleLoaded: boolean;
    schedulePromise: Promise<GroupSchedule>;
}
