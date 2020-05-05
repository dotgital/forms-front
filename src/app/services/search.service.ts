import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient,
  ) { }

  autocompleSearch(search) {
    return this.http.get<[]>(`${environment.backendUrl}/search?_q=${search}&_limit=10&_sort=updatedAt:DESC`).pipe(map(res => {
      return res;
    }));
  }

}
