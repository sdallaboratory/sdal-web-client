import { GroupScheduleUri, DaySchedule, GroupSchedule, Lesson, WeekType } from '../interface/schedule.iterfaces';
import _ from 'lodash';

export default class ParserService {

    public parseGroupsUris(baseUri: string, document: Document) {
        const anchors = document.querySelectorAll('.list-group .panel .btn-group a');
        const groupsUris: GroupScheduleUri[] = [...anchors].map(anchor => ({
            uri: `${baseUri}${anchor.getAttribute('href')}`,
            name: anchor.textContent!.split(/\s/).join(''),
        }));
        return groupsUris;
    }

    public parseGroupSchedule(document: Document) {
        const schedule = {
            name: this.parseGroupName(document),
            days: this.parseDays(document),
        } as GroupSchedule;

        return schedule;
    }

    public parseCurrentWeek(document: Document) {
        const weekElem = document.querySelector('.page-header h4 i');

        if (!weekElem) {
            return {
                number: 0,
                weekName: 'Не учебная',
            };
        }
        const text = weekElem.textContent || '';
        const week = {
            number: +/\d+/.exec(text)![0],
            weekName: _.last(text.split(' '))!,
        };
        return week;
    }

    private parseGroupName(document: Document) {
        return document.querySelector('.page-header h1')!.textContent!.split(' ')[1];
    }

    private parseDays(document: Document) {
        return [...document.querySelectorAll('.hidden-xs tbody')].map(
            day => this.parseDaySchedule(day)
        );
    }

    private parseDaySchedule(tbody: Element) {
        return {
            name: this.parseName(tbody),
            numerator: this.parseSchedule(tbody, 'numerator'),
            denominator: this.parseSchedule(tbody, 'denominator'),
        } as DaySchedule;
    }

    private parseName(tbody: Element) {
        return tbody.querySelector('strong')!.textContent!.toLowerCase();
    }

    private parseSchedule(tbody: Element, weekType: WeekType) {
        return [...tbody.querySelectorAll('tr+tr+tr')].map(elem => {
            const timeRangeElement = elem.firstElementChild!;

            const lessonElement = weekType === 'numerator' 
                ? timeRangeElement.nextElementSibling! 
                : elem.lastElementChild!;
            const lessonDataElements = lessonElement.querySelectorAll('i, span');

            return {
                timeRange: timeRangeElement.textContent!,
                type: lessonDataElements[0]?.textContent || undefined,
                name: lessonDataElements[1]?.textContent || undefined,
                location: lessonDataElements[2]?.textContent || undefined,
                teacher: lessonDataElements[3]?.textContent!.replace(/\s/, ' ') || undefined,
            };
        }) as Lesson[];
    }

}
