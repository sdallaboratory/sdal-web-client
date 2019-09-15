export function getCampus(classroom: string): string | null {
    const normalized = classroom.toLowerCase();

    if (classroom.includes('каф')) {
        return null;
    }

    const letter = normalized.replace(/.*\d+/, '');
    console.log(letter);
    return null;
}
