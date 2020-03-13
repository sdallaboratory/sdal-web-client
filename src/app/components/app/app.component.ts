import { Component } from '@angular/core';
import { RouteParamsService } from '../../services/route-params.service';
import { ActivatedRoute } from '@angular/router';
import { ResponsiveService } from '../../services/responsive.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'sdal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [RouteParamsService],
})
export class AppComponent {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly params: RouteParamsService,
  ) {
    console.log(route, params['route']);
    params.init();
  }

  // public title = 'touch';
}
