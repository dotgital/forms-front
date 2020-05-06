import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private userId;

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
    private authSetvice: AuthService,
  ) {
    this.userId = this.authSetvice.currentUserValue.user.id;
  }

  // Graphql query and motation
  graphQl(query) {
    return this.apollo.query<any>({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  }

  // Get list of records passing the endpoint;
  getRecordList(endpoint: string) {
    return this.http.get<any>(`${environment.backendUrl}/${endpoint}`)
    .pipe(map(metaData => {
      return metaData;
    }));
  }

  // Get Record Data passing the endpoint and ID
  getRecordData(endpoint: string, id: string) {
    return this.http.get<any>(`${environment.backendUrl}/${endpoint}/${id}`)
    .pipe(map(metaData => {
      return metaData;
    }));
  }

  // Set the record data passing endpoint and Id
  createRecord(endpoint: string, data) {
    return this.http.post(`${environment.backendUrl}/${endpoint}`, data)
    .pipe(map(settings => {
      return settings;
    }));
  }

  // Update Record Data
  updateRecord(endpoint: string, id: string, data) {
    return this.http.put(`${environment.backendUrl}/${endpoint}/${id}`, data)
    .pipe(map(settings => {
      return settings;
    }));
  }

  // Upload Files to strapi
  uploadFile(file) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data');
    return this.http.post<any>(`${environment.backendUrl}/upload`, file, {
      reportProgress: true, // These fields are required to receive HttpEvents
      observe: 'events',
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return { status: 'progress', progress };
            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
      })
    );
  }

  /*
  Custom Requests
  */

  // Get table data
  getTableData(module: string, query, columns) {
    return this.http.post(`${environment.backendUrl}/list/${module}?${query}`, {columns})
    .pipe(map(settings => {
      return settings;
    }));
  }

  // Set settings for individual user
  setUserSetting(data) {
    return this.http.put<any>(`${environment.backendUrl}/user-update/${this.userId}`, {userPreferences: data})
    .pipe(map(settings => {
      return settings;
    }));
  }

  // Get custom settings
  getSettings(type, module) {
    return this.http.get<any>(`${environment.backendUrl}/global-preferences?type=${type}&module=${module}`)
    .pipe(map(settings => {
      return settings;
    }));
  }
}
