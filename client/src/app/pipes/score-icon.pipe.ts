import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scoreIcon'
})
export class ScoreIconPipe implements PipeTransform {

  transform(score: number) {
    if (score > 40) {
      return 'star';
    } else if (score > 35) {
      return 'star_half';
    } else {
      return 'navigate_next';
    }
  }

}
