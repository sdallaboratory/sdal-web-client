import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GroupSchedule, WeekInfo } from '../models/schedule-models';
import { Student } from '../models/student';
import { TargetsTelemetry } from '../models/telemetry-models';
import { TouchUser } from '../models/touch-auth-models';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly http: HttpClient
  ) { }

  // TODO: Uppercase on server-side
  public getSchedule(groupName: string): Observable<GroupSchedule> {
    return this.http.get<GroupSchedule>(`/api/schedule/groups/${groupName.toUpperCase()}`).pipe(
      tap((schedule: GroupSchedule) => schedule.name = schedule.name.trim())
    );
  }

  public getGroups() {
    return this.http.get<string[]>(`/api/schedule/groups`);
  }

  public searchStudents(query?: string, limit?: number, sessionId?: string) {
    return this.http.get<Student[]>(`/api/students`, {
      params: {
        query,
        limit,
        sessionId
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

  public getCurrentWeek() {
    return this.http.get<WeekInfo>('/api/schedule/current-week');
  }

  public signOut(sessionId: string) {
    return this.http.delete(`/api/touch/user/${sessionId}`);
  }

  public getTouchUser(sessionId: string) {
    return this.http.get<TouchUser | null>(`/api/touch/user/${sessionId}`);
  }

}

