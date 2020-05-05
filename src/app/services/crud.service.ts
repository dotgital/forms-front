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

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
  ) { }

  getMetadata(uid) {
    return this.http.get<any>(`${environment.backendUrl}/content-manager/content-types/${uid}`)
    .pipe(map(metaData => {
      return metaData;
    }));
  }

  getUserPermissions() {
    return this.http.get<any>(`${environment.backendUrl}/custom-permissions`)
    .pipe(map(metaData => {
      return metaData;
    }));
  }

  setUserPermissions(data) {
    return this.http.post(`${environment.backendUrl}/set-permissions/`, data)
    .pipe(map(settings => {
      return settings;
    }));
  }

  getList(module: string, query, columns) {
    return this.http.post(`${environment.backendUrl}/list/${module}?${query}`, {columns})
    .pipe(map(settings => {
      return settings;
    }));
  }

  getDatalist(query) {
    return this.apollo.query<any>({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  }

  getData(query) {
    return this.apollo.query<any>({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  }

  createData(module: string, data) {
    return this.http.post(`${environment.backendUrl}/${module}/`, data)
    .pipe(map(settings => {
      return settings;
    }));
  }

  updateData(module: string, id: string, data) {
    return this.http.put(`${environment.backendUrl}/${module}/${id}`, data)
    .pipe(map(settings => {
      return settings;
    }));
  }

  createUser(userData) {
    return this.http.post(`${environment.backendUrl}/users/`, userData)
    .pipe(map(settings => {
      return settings;
    }));
  }

  updateUser(userId, userData) {
    console.log(userId);
    return this.http.put(`${environment.backendUrl}/user-update/${userId}`, userData)
    .pipe(map(settings => {
      return settings;
    }));
  }

  // getRecordData(query){
  //   return this.apollo.query<any>({
  //     query: gql`${query}`,
  //     fetchPolicy: 'network-only',
  //     errorPolicy: 'all',
  //   });
  // }

  getRecordData(record: string, id: string) {
    return this.http.get<any>(`${environment.backendUrl}/${record}/${id}`)
    .pipe(map(metaData => {
      return metaData;
    }));
  }

  uploadAvatar(avatar) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<any>(`${environment.backendUrl}/upload`, avatar, {
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
}
