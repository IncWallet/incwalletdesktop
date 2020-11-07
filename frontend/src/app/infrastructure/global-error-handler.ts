import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor() { }

    handleError(error) {
        // const message = error.message ? error.message : error.toString();

        // use the Injector to be used to get any service

        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;
    }
}
