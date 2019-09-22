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
  private readonly groupsKey = 'groups';
  private readonly userKey = 'user';
  private readonly themeKey = 'theme';

  private set<T>(key: string, obj: T) {
    const stringified = JSON.stringify(obj);
    localStorage.setItem(key, stringified);
  }

  private get<T>(key: string) {
    const stringified = localStorage.getItem(key);
    return stringified && JSON.parse(stringified) as T || null;
  }

  public getTargets() {
    return this.get<StoredTarget[]>(this.targetsKey);
  }

  public setTargets(targets: Target[]) {
    const storingTargets: StoredTarget[] = targets.map(({ group, students, color }) => ({ group, students, color }));
    this.set(this.targetsKey, storingTargets);
  }

  public setGroups(groups: string[]) {
    this.set(this.groupsKey, groups);
  }

  public getGroups() {
    return this.get<string[]>(this.groupsKey);
  }

  public setUser(userInfo: any) {
    this.set(this.userKey, userInfo);
  }

  public getUser() {
    return this.get(this.userKey);
  }

  public setTheme(isDark: boolean) {
    return this.set(this.themeKey, isDark);
  }

  public getTheme() {
    return this.get(this.themeKey);
  }
}
