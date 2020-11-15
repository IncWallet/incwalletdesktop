import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import { PdeHistoryListRes } from './models/pde.model';

@Injectable({ providedIn: 'root' })
export class PdeClient {

  constructor(protected httpClient: HttpClient) {}
  history(pageindex: number, pagesize: number): Observable<PdeHistoryListRes> {
    // @ts-ignore
    return  from (new Promise((resolve,reject) => {
      // @ts-ignore
      window.backend.PdeCtrl.GetPdeTradeHistory(pageindex,pagesize,"","").then(res => {
        resolve(JSON.parse(res));
      }).catch(err => reject(JSON.parse(err)));
    }));
  }
}
