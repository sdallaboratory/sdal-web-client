import { Student } from './student';

export interface TouchUser {
    sessionId: string;
    student: Student | null;
}
