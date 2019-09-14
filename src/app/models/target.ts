import { Student } from './student';
import { GroupSchedule } from './schedule-models';

export class Target {
    group: string;
    students?: Student[];
    scheduleLoaded: boolean;
    schedulePromise: Promise<GroupSchedule>;
    color: string;
}
