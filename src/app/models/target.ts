import { Student } from './student';
import { GroupSchedule } from './schedule-models';

export interface Target {
    group: string;
    students?: Student[];
    scheduleLoaded: boolean;
    schedulePromise: Promise<GroupSchedule>;
    color: string;
}
