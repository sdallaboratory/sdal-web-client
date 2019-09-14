import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Target } from '../models/target';

@Injectable({
  providedIn: 'root'
})
export class TargetsService {

  private targetsSubject = new BehaviorSubject<Target[]>([]);
  public targets = this.targetsSubject.asObservable();

  constructor() { }
}
