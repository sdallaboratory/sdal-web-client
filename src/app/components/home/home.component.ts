import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { first, filter, tap, map } from 'rxjs/operators';
import { TargetsService } from '../../services/targets.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'sdal-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(
    public readonly changeDetectorRef: ChangeDetectorRef,
    public readonly media: MediaMatcher,
    public readonly responsive: ResponsiveService,
    public readonly target: TargetsService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1000px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.mobileQuery.addListener((event) => this.responsive.mobile.next(event.matches));
    this.responsive.mobile.next(this.mobileQuery.matches);
  }

  public opened = combineLatest(
    this.responsive.mobile,
    this.target.targetsObservable,
  ).pipe(
    map(([isMobile, targets]) => !(isMobile && targets && targets.length)),
    first(),
  );


  ngOnInit() {
  }

}
