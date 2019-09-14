import { Injectable } from '@angular/core';
import { Subject, of, merge } from 'rxjs';
import { normalizeText } from '../utils/normalize-query';
import { map, mergeMap } from 'rxjs/operators';
import { GroupsService } from './groups.service';
import { TargetsService } from './targets.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public readonly query = new Subject();

  private change = merge(this.query, this.targets)

  public readonly groups = this.query.pipe(
    map(normalizeText),
    map(q => ({ groups: [...this.groupsService.normalizedNames].filter(g => g.includes(q)), })),
  );

  public readonly students = this.query.pipe(
    map(normalizeText),
    mergeMap(q => !q ? of([]) : this.api.searchStudents(q, 10)),
  ).subscribe(d => console.log(d));

  constructor(
    private readonly groupsService: GroupsService,
    private readonly api: ApiService,
    private readonly targets: TargetsService,
  ) { }
}
