import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<any>(`${environment.backendUrl}content-manager/content-types/${uid}`)
    .pipe(map(metaData => {
      return metaData;
    }));
  }

  getDatalist(query) {
    return this.apollo.query<any>({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  }

  // getRecordData(query){
  //   return this.apollo.query<any>({
  //     query: gql`${query}`,
  //     fetchPolicy: 'network-only',
  //     errorPolicy: 'all',
  //   });
  // }

  getRecordData(record: string, id: string) {
    return this.http.get<any>(`${environment.backendUrl}${record}/${id}`)
    .pipe(map(metaData => {
      return metaData;
    }));
  }
}
