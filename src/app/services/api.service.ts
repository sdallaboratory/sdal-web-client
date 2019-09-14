import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GroupSchedule } from '../models/schedule-models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly http: HttpClient
  ) { }

  public getSchedule(groupName: string) {
    return this.http.get<GroupSchedule>(`/api/schedule/groups/${groupName}`);
  }

  public getGroups() {
    return this.http.get<string[]>(`/api/schedule/groups`);
  }

}
