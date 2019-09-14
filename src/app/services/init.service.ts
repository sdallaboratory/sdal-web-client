import { Injectable } from '@angular/core';
import { GroupsService } from './groups.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private isInitialized = false;

  constructor(
    private readonly groups: GroupsService,
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
      ]);
      console.log('Приложение было успешно инициализировано.');
    } catch {
      throw new Error('Во время инициализации приложения произошла ошибка.');
    }

  }
}
