const campuses = {
    л: 'УЛК',
    ю: 'ГЗ',
    э: 'Энерго',
    м: 'Машиностроение',
    // : 'Машиностроение',
} as any;

export function getCampus(classroom: string): string | null {
    const normalized = classroom.toLowerCase();

    if (classroom.includes('каф')) {
        return null;
    }

    let letter = normalized.replace(/.*\d+/, '');

    if (campuses.hasOwnProperty(letter)) {
        letter = campuses[letter];
    }

    console.log(normalized, letter);
    return letter;
}
