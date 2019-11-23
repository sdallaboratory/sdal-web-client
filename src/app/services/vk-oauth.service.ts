import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TouchUser } from '../models/touch-auth-models';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VkOauthService {

  public user = new BehaviorSubject<TouchUser | null>(null);

  constructor(
    private readonly session: SessionService,
    private readonly api: ApiService,
  ) { }

  public async init() {
    const user = await this.getUser();
    this.user.next(user);
  }

  // public authenticating = false;

  private async getUser() {
    const user = await this.api.getTouchUser(this.session.guid).toPromise();
    return user;
  }

  public async signIn() {
    if (this.user.value) {
      return null;
    }
    await this.openAuthDialog();
    const user = await this.getUser();
    this.user.next(user);
  }

  public async signOut() {
    await this.api.signOut(this.session.guid).toPromise();
    this.user.next(null);
  }

  private openAuthDialog(): Promise<void> {
    return new Promise((resolve, reject) => {


      // const redirectUri = 'https://sdal.pw/api/touch/oauth';
      const redirectUri = `${environment.backendOrigin}/api/touch/oauth`;
      // tslint:disable-next-line: max-line-length
      const dialog = window.open(`https://oauth.vk.com/authorize?client_id=${environment.vkAppId}&redirect_uri=${redirectUri}&scope=offline&response_type=code&v=5.101&state=${this.session.guid}`, 'oauth',
        'width=800,height=400');
      function checkRecursively() {
        if (!dialog || dialog.closed) {
          resolve();
        } else {
          setTimeout(() => checkRecursively(), 300);
        }
      }
      checkRecursively();
    });
  }
}
