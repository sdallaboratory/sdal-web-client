import { Injectable } from '@angular/core';
import { TargetsService } from './targets.service';
import { StorageService } from './storage.service';
import { Target } from '../models/target';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  public history = new Map<string, number>();

  constructor(
    private readonly targets: TargetsService,
    private readonly storage: StorageService,
  ) {
    this.history = storage.getHistory();
    targets.targetsObservable.subscribe(this.updateHistory.bind(this));
  }

  updateHistory(targets: Target[] | null) {
    for (const { group } of targets || []) {
      const count = this.history.get(group) || 0;
      this.history.set(group, count + 1);
    }
    this.storage.setHistory(this.history);
  }

}
