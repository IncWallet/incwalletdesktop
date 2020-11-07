import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GetViewableError } from './common-helper';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    const message = error.error ? GetViewableError(error.error) : error.toString();

                    this.toastr.error(message);

                    return throwError(error);
                }),
            );
    }
}
