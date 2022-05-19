import { Injectable } from '@angular/core';
import { GroupsService } from './groups.service';
import { TelemetryService } from './telemetry.service';
import { ScheduleService } from './schedule.service';
import { NowTimeService } from './now-time.service';
import { ThemeService } from './theme.service';
import { DemoService } from './demo.service';
import { VkOauthService } from './vk-oauth.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private isInitialized = false;

  constructor(
    private readonly groups: GroupsService,
    // private readonly telemetry: TelemetryService,
    private readonly theme: ThemeService,
    private readonly nowTime: NowTimeService,
    private readonly demo: DemoService,
    // private readonly auth: VkOauthService,
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
        this.demo.init(),
        // this.auth.init(),
      ]);
      console.log('Приложение было успешно инициализировано.');
    } catch {
      throw new Error('Во время инициализации приложения произошла ошибка.');
    }

  }
}
