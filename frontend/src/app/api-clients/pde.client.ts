import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PdeHistoryListRes } from './models/pde.model';

@Injectable({ providedIn: 'root' })
export class PdeClient {
  pdeHistoryApiEndpoint: string = `${environment.apiUrl}/pde/txhistory`;
  pdeHistoryChainApiEndpoint: string = `http://167.86.99.232/pde/txhistory`;
  constructor(protected httpClient: HttpClient) {}
  history(): Observable<PdeHistoryListRes> {
    return this.httpClient.get<PdeHistoryListRes>(
      `${this.pdeHistoryChainApiEndpoint}`,
      {}
    );
  }
}
