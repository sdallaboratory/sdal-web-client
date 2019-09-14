import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { merge, fromEvent } from 'rxjs';
import { map, distinct, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'sdal-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  public text;

  @ViewChild('query', { static: false })
  queryElem: ElementRef<HTMLInputElement>;

  constructor(
    public readonly search: SearchService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const input = this.queryElem.nativeElement;
    // Emit on clear
    merge(fromEvent(input, 'input'), fromEvent(input, 'change')).pipe(
      map(() => input.value),
      distinctUntilChanged(),
      debounceTime(200),
      // map()
    ).subscribe(q => this.search.query.next(q));
  }

}
