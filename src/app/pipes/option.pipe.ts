import { Pipe, PipeTransform } from '@angular/core';
import { RecommenderService } from '../services/recommender.service';
import { Option } from '../models/recommendations-models';

@Pipe({
  name: 'option'
})
export class OptionPipe implements PipeTransform {

  constructor(
    private readonly recommender: RecommenderService
  ) { }

  transform(option: Option) {
    return this.recommender.verbalize(option);
  }

}
