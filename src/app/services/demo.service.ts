import { Injectable } from '@angular/core';
import { TargetsService } from './targets.service';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  public ira = {
    name: 'Уланова Ирина Вадимовна',
    group: 'СГН3-72Б',
    avatar: 'https://sun9-35.userapi.com/c850720/v850720133/18ef38/lkCyM3Z0mTM.jpg?ava=1'
  };

  public serg = {
    name: 'Соловьев Сергей Александрович',
    group: 'СГН3-71Б'
  };

  constructor(
    private readonly targets: TargetsService,
  ) { }

  async init() {
    if (window.location.pathname.includes('/%D0%B4%D0%BB%D1%8F_%D0%B8%D1%80%D1%8B')) {
      this.targets.addGroup('СГН3-72Б', [this.ira]);
      this.targets.addGroup('СГН3-71Б', [this.serg]);
    }
  }
}
