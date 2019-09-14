import { Component, OnInit } from '@angular/core';
import { RecommenderService } from 'src/app/services/recommender.service';

@Component({
  selector: 'sdal-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {

  constructor(
    public readonly recommender: RecommenderService
  ) { }

  ngOnInit() {
  }

}
