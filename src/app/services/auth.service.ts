import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_interfaces/user';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject < User > ;
  public currentUser: Observable < User > ;
  public user: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private apollo: Apollo
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  register(registrationData){
    return this.http.post<any>(`${environment.backendUrl}auth/local/register`, {
      username: registrationData.email,
      email: registrationData.email,
      password: registrationData.password,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
    }).pipe(map(user => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  createCompany(registrationData, userId: string) {
    console.log(userId);
    return this.http.post<any>(`${environment.backendUrl}companies`, {
      name: registrationData.company,
      users: [userId]
    }).pipe(map(companyRes => {
      return companyRes;
    }));
  }

  login(username: string, pw: string) {
    const query = `mutation {
      login (input: { identifier: "${username}", password: "${pw}" } ){
        jwt
        user{
          id
          email
        }
      }
    }`;
    return this.apollo.mutate<any>({
      mutation: gql`${query}`
    }).pipe(map(user => {
        const userData: User = user.data.login;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.currentUserSubject.next(userData);
        return user;
      }));
    // return this.http.post<any>(`${environment.backendUrl}auth/local`, {
    //     identifier: username,
    //     password: pw
    //   })
    //   .pipe(map(user => {
    //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     this.currentUserSubject.next(user);
    //     return user;
    //   }));
  }

  forgotPassword(emailAddress: string) {
    return this.http.post<any>(`${environment.backendUrl}auth/forgot-password`, {
        email: emailAddress,
        url: `${environment.backendUrl}admin/plugins/users-permissions/auth/reset-password`
      })
      .pipe(map(user => {
        return user;
      }));
  }

  reset(code: string, pw: string, pwcnf: string) {
    return this.http.post<any>( `${environment.backendUrl}auth/reset-password`, {
        code,
        password: pw,
        passwordConfirmation: pwcnf
      })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    this.currentUserSubject.next(null);
  }
}
