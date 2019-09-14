import { Injectable, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  public readonly mobile = new Subject<boolean>();

  // ngOnDestroy(): void {
  //   this.mobileQuery.removeListener(this.mobileQueryListener);
  // }
}
