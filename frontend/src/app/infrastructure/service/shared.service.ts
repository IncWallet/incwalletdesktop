import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SharedService {
  private spinnerChange$ = new Subject<{ loading: boolean }>();

  onSpinnerChanged(): Observable<{ loading: boolean }> {
    return this.spinnerChange$.asObservable();
  }

  showSpinner() {
      this.spinnerChange$.next({loading: true});
  }

  hideSpinner() {
    this.spinnerChange$.next({loading: false});
  }
}
