import { Component, OnInit, Input } from '@angular/core';
import { CombinedDaySchedule, FullLesson } from 'src/app/models/schedule-models';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'sdal-schedule-day',
  templateUrl: './schedule-day.component.html',
  styleUrls: ['./schedule-day.component.scss']
})
export class ScheduleDayComponent implements OnInit {

  @Input()
  public day!: CombinedDaySchedule;

  constructor(
    private readonly schedule: ScheduleService,
  ) { }

  ngOnInit() {
  }

  public selectLesson(lesson: FullLesson, event: MouseEvent) {
    if (event.buttons) {
      this.schedule.selectedLesson.next(lesson);
    }
  }

}
