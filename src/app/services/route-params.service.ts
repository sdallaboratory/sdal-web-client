import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Target } from '../models/target';
import { TargetsService } from './targets.service';
import { map, skip, tap, first, take } from 'rxjs/operators';

@Injectable()
export class RouteParamsService {

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly targets: TargetsService,
  ) {
    targets.targetsObservable.pipe(
      skip(1),
      tap(console.log),
      map(ts => ts || []),
    ).subscribe(this.updateRoute.bind(this));
  }

  public updateRoute(targets: Target[]) {
    const groups = targets.map(target => target.group).join(',');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: groups.length && { groups } || {},
      queryParamsHandling: 'merge',
    });
  }

  private async loadFromRoute() {
    const groups = await this.route.queryParamMap.pipe(
      skip(1),
      map(params => params.get('groups')),
      map(groupsString => groupsString && groupsString.split(',') || []),
      first(),
    ).toPromise();
    console.log(groups);
    for (const group of groups) {
      this.targets.addGroup(group);
    }
  }

  public init() {
    this.loadFromRoute();
  }
}
