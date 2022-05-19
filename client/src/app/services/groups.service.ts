import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { normalizeText } from '../utils/normalize-query';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  public names!: Set<string>;

  constructor(
    private readonly api: ApiService,
    private readonly storage: StorageService
  ) { }

  public async init() {
    let groups = this.storage.getGroups();
    if (!groups) {
      groups = await this.api.getGroups().toPromise();
      this.storage.setGroups(groups);
    } else {
      this.api.getGroups().toPromise().then(gs => {
        this.storage.setGroups(gs);
        this.names = new Set(gs);
      });
    }
    this.names = new Set(groups);
  }

}
