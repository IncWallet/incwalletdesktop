import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StateClient } from '../api-clients/state.client';
import { Auth } from './common-helper';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private stateClient: StateClient, private router: Router) {
  }

   canActivate() {
    return this.stateClient
      .info().pipe(map(res => {
        if (!Auth.IsLoggedInWallet(res)) {
          this.router.navigate(['/', 'wallet/login']);
        }
        return true;
      }));
  }
}
