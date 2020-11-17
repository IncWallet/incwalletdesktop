import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LocalStorage } from '../common-helper';
import { HIDE_MASH } from '../utils/constant';

@Injectable()
export class SharedService {
  private spinnerChange$ = new Subject<{ loading: boolean }>();
  private mashModeChange$ = new Subject<{ hideDataMash: boolean }>();

  onSpinnerChanged(): Observable<{ loading: boolean }> {
    return this.spinnerChange$.asObservable();
  }

  showSpinner() {
      this.spinnerChange$.next({loading: true});
  }

  hideSpinner() {
    this.spinnerChange$.next({loading: false});
  }

  onMashModeChanged(): Observable<{ hideDataMash: boolean }> {
    return this.mashModeChange$.asObservable();
  }

  get hideDataMash(): boolean {
    return LocalStorage.hasKey(HIDE_MASH) ? LocalStorage.getValue(HIDE_MASH) : false;
  }

  toggleDataMash() {
    this.mashModeChange$.next({hideDataMash: !this.hideDataMash});
    LocalStorage.setValue(HIDE_MASH, !this.hideDataMash);
  }
}
