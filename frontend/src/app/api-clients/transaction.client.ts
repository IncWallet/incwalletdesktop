import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Transaction } from './models/transaction.model';
import { from } from 'rxjs/internal/observable/from';

@Injectable({ providedIn: 'root' })
export class TransactionClient {
    constructor() {
    }

    history(pagesize: number, pageindex: number, tokenID: string = ''): Observable<any> {
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
