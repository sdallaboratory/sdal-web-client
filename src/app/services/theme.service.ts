import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

type ThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly html = document.getElementsByTagName('html').item(0)!;

  private _isDark = false;

  public get isDark() {
    return this._isDark;
  }
  public set isDark(v: boolean) {
    this._isDark = v;
    this.html.className = this._isDark ? 'sdal-dark' : 'sdal-light';
    this.storage.setTheme(this.isDark);
  }


  constructor(
    private readonly storage: StorageService
  ) {
    const isDark = storage.getTheme();
    console.log(isDark);

    if (typeof isDark === 'boolean') {
      this.isDark = isDark;
    }
  }


}
