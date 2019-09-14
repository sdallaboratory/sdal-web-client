import { Injectable } from '@angular/core';
import { Subject, of, merge } from 'rxjs';
import { normalizeText } from '../utils/normalize-query';
import { map, mergeMap, filter, combineLatest } from 'rxjs/operators';
import { GroupsService } from './groups.service';
import { TargetsService } from './targets.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public readonly query = new Subject<string>();

  private change = merge(this.query, this.targets.targets);

  public readonly groups = this.query.pipe(
    map(normalizeText),
    map(q => ([...this.groupsService.normalizedNames].filter(g => g.includes(q)))),
    combineLatest(this.targets.targets),
    map(([groups, targets]) => groups.filter(g => !targets.map(t => t.group).includes(g)))
  );

  // TODO: Handle update on targets
  public readonly students = this.query.pipe(
    map(normalizeText),
    mergeMap(q => !q ? of([]) : this.api.searchStudents(q, 10)),
    // filter(s => )
  ).subscribe(d => console.log(d));

  constructor(
    private readonly groupsService: GroupsService,
    private readonly api: ApiService,
    private readonly targets: TargetsService,
  ) { }
}
