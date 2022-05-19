const days = {
    1: 'пн',
    2: 'вт',
    3: 'ср',
    4: 'чт',
    5: 'пт',
    6: 'сб',
    7: 'вс',
};

export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function getDayFromNuber(dayNumber: DayNumber) {
    return days[dayNumber];
}
