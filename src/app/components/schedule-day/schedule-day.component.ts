import { Component, OnInit, Input } from '@angular/core';
import { CombinedDaySchedule, FullLesson, ScheduleTimeSlot } from 'src/app/models/schedule-models';
import { ScheduleService } from 'src/app/services/schedule.service';
import { NowTimeService } from 'src/app/services/now-time.service';

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
    private readonly nowTime: NowTimeService,
  ) { }

  public width = 100;

  public get hash() {
    return decodeURI(location.hash).slice(1);
  }

  ngOnInit() {
    this.schedule.combinedSchedule.subscribe(s => {
      this.width = 100 / (s && s[0].days[0].timeSlots[0].groupsLessons.length || 1);
    });
  }

  public selectLesson(lesson: FullLesson) {
    this.schedule.selectedLesson.next(lesson);
  }

  public get id() {
    // TODO: Filth
    const { week, day } = this.day.timeSlots[0].groupsLessons[0];
    return `${week}-${day}`.toLowerCase();
  }

  public get isToday() {
    const { week, day } = this.day.timeSlots[0].groupsLessons[0];
    return this.nowTime.today === day && this.nowTime.currentWeek.weekName === week;
  }

  public get groups() {
    return this.day.timeSlots[0].groupsLessons.map(l => l.group);
  }

  public getSlotId(slot: ScheduleTimeSlot) {
    const range = slot.timeRange.replace(' - ', '-');
    return `${this.id}-${range}`;
  }
}
