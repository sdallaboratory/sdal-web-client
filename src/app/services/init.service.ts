import { Injectable } from '@angular/core';
import { GroupsService } from './groups.service';
import { TelemetryService } from './telemetry.service';
import { ScheduleService } from './schedule.service';
import { NowTimeService } from './now-time.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private isInitialized = false;

  constructor(
    private readonly groups: GroupsService,
    private readonly telemetry: TelemetryService,
    private readonly nowTime: NowTimeService,
  ) { }

  /**
   * Method to be executed befor the app starts.
   */
  public async init() {
    if (this.isInitialized) {
      throw new Error('Попытка повторной инициализации приложения');
    }
    this.isInitialized = true;
    try {
      // Here you can add your async initialization logic.
      await Promise.all([
        this.groups.init(),
        this.nowTime.init(),
      ]);
      console.log('Приложение было успешно инициализировано.');
    } catch {
      throw new Error('Во время инициализации приложения произошла ошибка.');
    }

  }
}
