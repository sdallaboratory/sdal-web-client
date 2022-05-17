import { Component, OnInit } from '@angular/core';
import { RecommenderService } from 'src/app/services/recommender.service';
import _ from 'lodash';
import { Option } from '../../models/recommendations-models';

@Component({
  selector: 'sdal-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {

  public full = false;

  constructor(
    public readonly recommender: RecommenderService
  ) { }

  ngOnInit() {
  }

  public move(option: Option) {
    const timeRange = option.timeRange.replace(' - ', '-');
    location.hash = '';
    setTimeout(() => location.hash = `${option.week}-${option.day}-${timeRange}`, 50);
  }

}
