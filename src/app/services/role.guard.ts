import { ErrorMessagesService } from './error-messages.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private errorMessageService: ErrorMessagesService,
) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authenticationService.currentUserValue;
      if (currentUser.user.role.type === 'administrator') {
          return true;
      }
      this.errorMessageService.showError('You Dont have access to this Page');

      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
  }

}
