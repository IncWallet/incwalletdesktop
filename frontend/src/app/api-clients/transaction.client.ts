import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Transaction } from './models/transaction.model';
import { from } from 'rxjs/internal/observable/from';

@Injectable({ providedIn: 'root' })
export class TransactionClient {
    historyApiEndpoint = (pagesize: number, pageindex: number): string =>
    `${environment.apiUrl}/transactions/history?pageindex=${pageindex}&pagesize=${pagesize}`

    constructor(protected httpClient: HttpClient) {
    }

    history(pagesize: number, pageindex: number): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.TransactionsCtrl.GetTxHistory(pageindex, pagesize, tokenID).then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }

    create(model: Transaction): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.TransactionsCtrl.InitTransaction(model.receivers, model.fee, model.info, model.passphrase).then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }

    createToken(model: Transaction): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.TransactionsCtrl.InitTokenTransaction(model.receivers, model.fee, model.info, model.tokenid, model.passphrase)
        .then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }
}
