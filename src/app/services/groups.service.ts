import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  public groupsNames: string[];

  constructor(
    private readonly api: ApiService
  ) { }

  public async init() {
    this.groupsNames = await this.api.getGroups().toPromise();
  }

}
