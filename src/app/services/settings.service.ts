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

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
  ) {
  }

  getUsers() {
    return this.http.get(`${environment.backendUrl}users`).pipe(map(res => {
      return res;
    }));
  }

  getFieldSettings() {
    const query = `query {
      setting (id: "${environment.settingsId}") {
        fields
      }
    }`;
    return this.apollo.query<FormItem[]>({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }).pipe(map(res => {
      const resp: any = res.data;
      return resp.setting.fields;
    }));
    // return this.http.get<FormItem[]>(`${environment.backendUrl}settings/5e822e6ffdf2c30517c789f1`).pipe(map(res => {
    //   return res;
    // }));
  }

  setFieldSettings(fields) {
    return this.http.put<FieldSettings>(`${environment.backendUrl}settings/${environment.settingsId}`, {fields})
    .pipe(map(settings => {
      return settings;
    }));
  }
}
