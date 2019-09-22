import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptorService } from './interceptors/api-interceptor.service';
import { MaterialImportsModule } from './material-imports/material-imports.module';
import { HomeComponent } from './components/home/home.component';
import { InitService } from './services/init.service';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { TargetsComponent } from './components/targets/targets.component';
import { ScheduleTableComponent } from './components/schedule-table/schedule-table.component';
import { ScheduleDayComponent } from './components/schedule-day/schedule-day.component';
import { LessonTooltipPipe } from './pipes/lesson-tooltip.pipe';
import { LessonDetailsComponent } from './components/lesson-details/lesson-details.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { LessonNumberPipe } from './pipes/lesson-number.pipe';
import { OptionPipe } from './pipes/option.pipe';
import { HasSchedulePipe } from './pipes/has-schedule.pipe';
import { ScoreIconPipe } from './pipes/score-icon.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { WeekPipe } from './pipes/week.pipe';
import { TimeRangePipe } from './pipes/time-range.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    TargetsComponent,
    ScheduleTableComponent,
    ScheduleDayComponent,
    LessonTooltipPipe,
    LessonDetailsComponent,
    RecommendationsComponent,
    LessonNumberPipe,
    OptionPipe,
    HasSchedulePipe,
    ScoreIconPipe,
    FooterComponent,
    AboutModalComponent,
    WeekPipe,
    TimeRangePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialImportsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (init: InitService) => () => init.init(),
      deps: [InitService],
      multi: true
    },
    LessonNumberPipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [AboutModalComponent]
})
export class AppModule { }
