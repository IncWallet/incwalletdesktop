import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AddressBooksReq } from './models/address-book.model';
import { from } from 'rxjs/internal/observable/from';

@Injectable({ providedIn: 'root' })
export class AddressBookClient {
    constructor(protected httpClient: HttpClient) {
    }

    add(model: AddressBooksReq): Observable<any> {
        return from(new Promise((resolve, reject) => {
            // @ts-ignore
            window.backend.AddressBookCtrl.AddAddress(model.name, model.paymentaddress, model.chainname).then(res => {
              resolve(JSON.parse(res));
            }).catch(err => reject(JSON.parse(err)));
          }));
    }

    remove(model: AddressBooksReq): Observable<any> {
        return from(new Promise((resolve, reject) => {
            // @ts-ignore
            window.backend.AddressBookCtrl.RemoveAddress(model.name, model.paymentaddress).then(res => {
              resolve(JSON.parse(res));
            }).catch(err => reject(JSON.parse(err)));
          }));
    }

    getAll(): Observable<any> {
        return from(new Promise((resolve, reject) => {
            // @ts-ignore
            window.backend.AddressBookCtrl.GetAll().then(res => {
              resolve(JSON.parse(res));
            }).catch(err => reject(JSON.parse(err)));
          }));
    }
}
