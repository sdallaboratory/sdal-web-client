import { Student } from '../models/student';

export function compareStudents(student1: Student, student2: Student) {
    return student1.name === student2.name
        && student1.group === student2.group
        && student1.vk_id === student2.vk_id;
}
