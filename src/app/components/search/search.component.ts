import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { merge, fromEvent, Subject } from 'rxjs';
import { map, distinct, distinctUntilChanged, debounceTime, mergeMap, first } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { TargetsService } from 'src/app/services/targets.service';

@Component({
  selector: 'sdal-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @ViewChild('query', { static: false })
  private queryElem!: ElementRef<HTMLInputElement>;

  public readonly addFirst = new Subject();

  public clear = new Subject();

  constructor(
    public readonly search: SearchService,
    public readonly targets: TargetsService
  ) {
    this.addFirst.pipe(
      mergeMap(() => search.results.pipe(first())),
    ).subscribe(({ students, groups }) => {
      console.log('GO');

      if (groups && groups.length) {
        this.targets.addGroup(groups[0]);
      } else if (students && students.length) {
        this.targets.addStudent(students[0]);
      }
    })
  }

  public searchResultLength = this.search.results.pipe(
    map(({ groups, students }) => (groups && groups.length || 0) + (students && students.length || 0)),
  );

  ngOnInit() {
  }

  ngAfterViewInit() {
    const input = this.queryElem.nativeElement;
    // Emit on clear
    merge(fromEvent(input, 'input'), fromEvent(input, 'change'), this.clear).pipe(
      map(() => input.value),
      distinctUntilChanged(),
      debounceTime(400),
      // map()
    ).subscribe(q => this.search.query.next(q));
  }

  public addGroup(group: string) {
    this.targets.addGroup(group);
  }


}
