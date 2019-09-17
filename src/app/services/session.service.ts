import { Injectable } from '@angular/core';
import { createGuid } from '../utils/create-guid';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public readonly guid: string;
  public readonly startTimeMs: number;

  constructor() {
    let guid = sessionStorage.getItem('sessionId');
    if (!guid) {
      guid = createGuid();
      sessionStorage.setItem('sessionId', guid);
    }
    this.guid = guid;

    let milliseconds: string | number | null = sessionStorage.getItem('sessionMs');
    if (!milliseconds) {
      milliseconds = new Date().getTime();
      sessionStorage.setItem('sessionMs', milliseconds.toString());
    }
    this.startTimeMs = +milliseconds;
  }
}
