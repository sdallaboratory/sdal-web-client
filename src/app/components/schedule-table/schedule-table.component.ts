import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'sdal-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.scss']
})
export class ScheduleTableComponent implements OnInit {

  constructor(
    public readonly schedule: ScheduleService
  ) { }

  ngOnInit() {
  }

}
