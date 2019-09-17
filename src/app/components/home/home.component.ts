import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { MediaMatcher } from '@angular/cdk/layout';

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
    public readonly responsive: ResponsiveService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1000px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.mobileQuery.addListener((event) => this.responsive.mobile.next(event.matches));
    this.responsive.mobile.next(this.mobileQuery.matches);
  }

  ngOnInit() {
  }

}
