export function enumerate(...terms: string[]): string {
    if (terms.length === 1) {
        return terms[0];
    }

    const [last, ...rest] = terms.reverse();
    return rest.join(', ') + ` и ${last}`;
}
