import { Injectable } from '@angular/core';
import { StoredTarget, Target } from '../models/target';
import { ApiService } from './api.service';
import { GroupSchedule } from '../models/schedule-models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private readonly api: ApiService,
  ) { }

  private readonly targetsKey = 'touch:targets';
  private readonly groupsKey = 'touch:groups';
  private readonly userKey = 'touch:user';
  private readonly themeKey = 'touch:theme';
  private readonly historyKey = 'touch:history';

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

  public setHistory(history: Map<string, number>) {
    const pairs = [...history.entries()];
    this.set(this.historyKey, pairs);
  }

  public getHistory() {
    const pairs = this.get<Array<[string, number]>>(this.historyKey) || [];
    return new Map(pairs);
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

  public setGroupSchedule(schedule: GroupSchedule) {
    const key = `touch:group:${schedule.name}`;
    return this.set(key, schedule);
  }

  public getGroupSchedule(group: string) {
    const key = `touch:group:${group}`;
    return this.get<GroupSchedule>(key);
  }

  public hasGroupSchedule(group: string) {
    const key = `touch:group:${group}`;
    return localStorage.getItem(key) != null;
  }
}
