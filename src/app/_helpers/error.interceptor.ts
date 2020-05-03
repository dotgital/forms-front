import { ErrorMessagesService } from './../services/error-messages.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './../services/auth.service';
// import { AuthenticationService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthService,
        private router: Router,
        private errorMessageService: ErrorMessagesService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                // location.reload(true);
            }
            if (err.status === 403) {
              this.errorMessageService.showError(err.error.message.message);
              // this.router.navigate(['/']);
            }
            // console.log(err)
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
