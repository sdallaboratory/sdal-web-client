import { Pipe, PipeTransform } from '@angular/core';
import { GroupsService } from '../services/groups.service';

@Pipe({
  name: 'hasSchedule'
})
export class HasSchedulePipe implements PipeTransform {

  constructor(
    private readonly groups: GroupsService,
  ) { }

  transform(group: string) {
    return this.groups.names.has(group);
  }

}
