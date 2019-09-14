import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { normalizeText } from '../utils/normalize-query';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  public normalizedNames!: Set<string>;

  constructor(
    private readonly api: ApiService
  ) { }

  public async init() {
    const groupsNames = await this.api.getGroups().toPromise();
    const normalized = groupsNames.map(normalizeText);
    this.normalizedNames = new Set(normalized);
  }

}
