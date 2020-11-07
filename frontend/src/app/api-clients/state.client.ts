import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateClient {
    constructor() {
    }

    info(): Observable<any> {
        return from(new Promise((resolve, reject) => {
            // @ts-ignore
            window.backend.WalletCtrl.GetState().then(res => {
              resolve(JSON.parse(res));
            }).catch(err => reject(JSON.parse(err)));
          }));
    }
}
