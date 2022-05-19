import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'sdal-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.scss']
})
export class LessonDetailsComponent implements OnInit {

  constructor(
    public readonly schedule: ScheduleService,
  ) { }

  ngOnInit() {
  }

}
