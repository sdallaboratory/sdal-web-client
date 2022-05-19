import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Pipe({
  name: 'inStorage'
})
export class InStoragePipe implements PipeTransform {

  constructor(
    private readonly storage: StorageService,
  ) { }

  transform(group: string): any {
    return this.storage.hasGroupSchedule(group);
  }

}
