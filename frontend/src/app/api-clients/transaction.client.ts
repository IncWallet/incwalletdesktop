import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {Transaction} from "./models/transaction.model";

@Injectable({ providedIn: 'root' })
export class TransactionClient {

  constructor(protected httpClient: HttpClient) {}
  history(pageindex: number, pagesize: number): Observable<any> {
    // @ts-ignore
    return  from (new Promise((resolve,reject) => {
      // @ts-ignore
      window.backend.TransactionsCtrl.GetTxHistory(pageindex,pagesize,"").then(res => {
        resolve(JSON.parse(res));
      }).catch(err => reject(JSON.parse(err)));
    }));
  }
}
