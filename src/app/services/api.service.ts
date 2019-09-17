import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GroupSchedule } from '../models/schedule-models';
import { Student } from '../models/student';
import { TargetsTelemetry } from '../models/telemetry-models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly http: HttpClient
  ) { }

  // TODO: Uppercase on server-side
  public getSchedule(groupName: string) {
    return this.http.get<GroupSchedule>(`/api/schedule/groups/${groupName.toUpperCase()}`);
  }

  public getGroups() {
    return this.http.get<string[]>(`/api/schedule/groups`);
  }

  public searchStudents(query?: string, limit?: number) {
    return this.http.get<Student[]>(`/api/students`, {
      params: {
        query,
        limit,
        // group: { $exists: true },
      } as any
    });
  }

  public sendComment(comment: string) {

    const message = {
      comment,
      timestamp: new Date().getTime(),
    };

    return this.http.post('/api/touch/comments', message);
  }

  public sendTargetsTelemetry(targetsInfo: TargetsTelemetry) {
    return this.http.post('/api/touch/telemetry/targets', targetsInfo);
  }

}
