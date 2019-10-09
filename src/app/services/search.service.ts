import { Injectable } from '@angular/core';
import { Subject, of, merge, BehaviorSubject } from 'rxjs';
import { normalizeText } from '../utils/normalize-query';
import { map, mergeMap, filter, combineLatest, catchError, tap, startWith } from 'rxjs/operators';
import { combineLatest as combineLatestStatic } from 'rxjs';
import { GroupsService } from './groups.service';
import { TargetsService } from './targets.service';
import { ApiService } from './api.service';
import _ from 'lodash';
import { Student } from '../models/student';
import { compareStudents } from '../utils/compare-students';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public readonly query = new BehaviorSubject<string>('');

  // private change = merge(this.query, this.targets.targetsObservable);

  public readonly groups = this.query.pipe(
    map(normalizeText),
    map(q => ([...this.groupsService.names].filter(g => g.includes(q)))),
    combineLatest(this.targets.targetsObservable), // TODO: Check this
    map(([groups, targets]) => groups.filter(g => !targets || !targets.map(t => t.group).includes(g))),
    map(groups => _.take(groups, 8)),
    map(groups => groups.length ? groups : null),
  );

  // TODO: Handle update on targets
  public readonly students = this.query.pipe(
    map(normalizeText),
    mergeMap(q => !q ? of<Student[]>([]) : this.api.searchStudents(q, 8, this.session.guid)),
    combineLatest(this.targets.targetsStudents.pipe(startWith([]))),
    map(([students, targetedStudents]) => students.filter(s => !_.find(targetedStudents || [], ts => compareStudents(s, ts)))),
    // TODO: mark as noSchedule.
    map(students => students.filter(s => this.groupsService.names.has(s.group))),
    catchError(() => of<Student[]>([])),
    map(students => students.length ? students : null),
  );

  public results = combineLatestStatic(this.groups, this.students).pipe(
    map(([groups, students]) => ({ groups, students })),
  );

  constructor(
    private readonly groupsService: GroupsService,
    private readonly api: ApiService,
    private readonly targets: TargetsService,
    private readonly session: SessionService,
  ) { }
}
