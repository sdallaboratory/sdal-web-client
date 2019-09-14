import { Injectable } from '@angular/core';
import { StoredTarget, Target } from '../models/target';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private readonly api: ApiService,
  ) { }

  private readonly targetsKey = 'targets';

  public getGroups() {
    const targets = this.getTargets();
    return targets && targets.map(t => t.group);
  }

  public getTargets() {
    const stringifiedTargets = localStorage.getItem(this.targetsKey);
    if (!stringifiedTargets) {
      return null;
    }
    const storedTargets = JSON.parse(stringifiedTargets) as StoredTarget[];
    return storedTargets;
    // TODO: Restore targets or whatever...
    // const targets = storedTargets.map(t => {...t, })
  }

  public saveTargets(targets: Target[]) {
    const storingTargets: StoredTarget[] = targets.map(({ group, students, color }) => ({ group, students, color }));
    const stringifiedTargets = JSON.stringify(storingTargets);
    localStorage.setItem(this.targetsKey, stringifiedTargets);
  }
}
