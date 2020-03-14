import { FieldSettings } from './../_interfaces/field-settings';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getUsers() {
    return this.http.get(`${environment.backendUrl}users`).pipe(map(res => {
      return res;
    }));
  }

  getFieldSettings() {
    return this.http.get<FieldSettings>(`${environment.backendUrl}settings/5e6a74414729a607d0f4f81f`).pipe(map(res => {
      return res;
    }));
  }

  setFieldSettings(fields) {
    return this.http.put<FieldSettings>(`${environment.backendUrl}settings/5e6a74414729a607d0f4f81f`, {fields})
    .pipe(map(settings => {
      return settings;
    }));
  }
}
