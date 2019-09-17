import { Injectable } from '@angular/core';
import { TargetsService } from './targets.service';
import { ApiService } from './api.service';
import { filter, map } from 'rxjs/operators';
import { TelemetryTarget, TargetsTelemetry } from '../models/telemetry-models';
import { Target } from '../models/target';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {

  constructor(
    private readonly targets: TargetsService,
    private readonly api: ApiService,
    private readonly session: SessionService,
  ) {
    targets.targetsObservable.pipe(
      filter(ts => !!ts),
      map(ts => ts!),
      map(ts => this.createTargetsTelemetry(ts)),
    ).subscribe(ts => {
      this.api.sendTargetsTelemetry(ts).toPromise();
    });
  }

  private createTargetsTelemetry(targets: Target[]) {
    console.log(this.session);
    const timestamp = new Date().getTime();
    return {
      sessionId: this.session.guid,
      sessionMs: timestamp - this.session.startTimeMs,
      timestamp,
      targets: targets.map(({ group, students }) => ({
        group,
        studentsNames: students && students.map(s => s.name),
      } as TelemetryTarget)),
    } as TargetsTelemetry;
  }
}
