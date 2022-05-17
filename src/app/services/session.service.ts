import { Injectable } from '@angular/core';
import { createGuid } from '../utils/create-guid';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public readonly guid: string;
  public readonly startTimeMs: number;

  constructor() {
    let guid = localStorage.getItem('sessionId');
    if (!guid) {
      guid = createGuid();
      localStorage.setItem('sessionId', guid);
    }
    this.guid = guid;

    let milliseconds: string | number | null = localStorage.getItem('sessionMs');
    if (!milliseconds) {
      milliseconds = new Date().getTime();
      localStorage.setItem('sessionMs', milliseconds.toString());
    }
    this.startTimeMs = +milliseconds;
  }
}
