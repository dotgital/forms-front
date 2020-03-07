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

  getDatalist(query) {
    return this.apollo.query<any>({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  }
}
