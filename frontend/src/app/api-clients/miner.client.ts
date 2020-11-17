import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';

@Injectable({ providedIn: 'root' })
export class MinerClient {
    constructor(protected httpClient: HttpClient) {
    }
    info(): Observable<any> {
        return from(new Promise((resolve, reject) => {
            // @ts-ignore
            window.backend.MinerCtrl.GetAllMinerInfo().then(res => {
              resolve(JSON.parse(res));
            }).catch(err => reject(JSON.parse(err)));
          }));
    }
}
