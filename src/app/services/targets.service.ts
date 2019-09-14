import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Target } from '../models/target';
import { ApiService } from './api.service';
import _ from 'lodash';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class TargetsService {

  constructor(
    private readonly api: ApiService,
    private readonly storage: StorageService
  ) {
    const groups = this.storage.getGroups();
    if (groups) {
      for (const group of groups) {
        this.addGroup(group);
      }
    }
  }

  private targets: Target[] = [];

  private readonly targetsSubject = new BehaviorSubject<Target[]>(this.targets);

  public readonly targetsObservable = this.targetsSubject.asObservable().pipe(
    map(targets => targets.length ? targets : null),
  );

  public addGroup(group: string) {
    const existedTarget = this.targets.find(t => t.group === group);
    if (existedTarget) {
      return existedTarget;
    }

    const schedulePromise = this.api.getSchedule(group).toPromise();

    const target: Target = {
      group,
      color: '#adffda',
      schedulePromise,
      scheduleLoaded: false,
    };

    schedulePromise.then((d) => {
      target.scheduleLoaded = true;
      console.log(d);
    });

    this.targets.push(target);
    this.targetsSubject.next(this.targets);
    this.storage.saveTargets(this.targets);

    return target;
  }

  public removeGroup(group: string) {
    const target = this.targets.find(t => t.group === group);
    _.remove(this.targets, target);
    this.targetsSubject.next(this.targets);
    this.storage.saveTargets(this.targets);
    return target;
  }

  public clear() {
    this.targets = [];
    this.targetsSubject.next(this.targets);
    this.storage.saveTargets(this.targets);
  }

}
