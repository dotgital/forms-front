import { AuthService } from './auth.service';
import { Apollo } from 'apollo-angular';
import { FormItem } from './../_interfaces/form-item';
import { FieldSettings } from './../_interfaces/field-settings';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private userId;
  constructor(
    private http: HttpClient,
    private apollo: Apollo,
    private authSetvice: AuthService,
  ) {
    this.userId = this.authSetvice.currentUserValue.user.id;
  }

  getUsers() {
    return this.http.get(`${environment.backendUrl}users`).pipe(map(res => {
      return res;
    }));
  }

  getSettings(type, module) {
    return this.http.get<any>(`${environment.backendUrl}fields-settings?type=${type}&module=${module}`)
    .pipe(map(settings => {
      return settings;
    }));
  }

  getFieldSettings() {
    return this.http.get<any>(`${environment.backendUrl}fields-settings/`)
    .pipe(map(settings => {
      return settings;
    }));
  }

  setUserSetting(data) {
    return this.http.put<any>(`${environment.backendUrl}users/${this.userId}`, {userPreferences: {listView: data}})
    .pipe(map(settings => {
      return settings;
    }));
  }

  setFieldSettings(fields) {
    return this.http.put<any>(`${environment.backendUrl}fields-settings/`, {fields})
    .pipe(map(settings => {
      return settings;
    }));
  }

  // setColumnsPreference(columns) {
  //   console.log(columns);
  //   return this.http.put<any>(`${environment.backendUrl}fields-settings/`, {data: {columns}})
  //   .pipe(map(settings => {
  //     return settings;
  //   }));
  // }
}
