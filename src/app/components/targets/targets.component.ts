import { Component, OnInit } from '@angular/core';
import { TargetsService } from 'src/app/services/targets.service';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'sdal-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss']
})
export class TargetsComponent implements OnInit {

  constructor(
    public readonly targets: TargetsService,
    public readonly responsive: ResponsiveService
  ) { }

  ngOnInit() {
  }

}
