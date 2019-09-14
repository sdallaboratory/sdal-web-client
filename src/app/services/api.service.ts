import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GroupSchedule } from '../models/schedule-models';
import { Student } from '../models/student';

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

  public searchStudents(query?: string, limit?: number) {
    return this.http.get<Student[]>(`/api/students`, {
      params: {
        query,
        limit
      } as any
    });
  }

}
