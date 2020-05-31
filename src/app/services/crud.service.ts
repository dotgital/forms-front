import { DeleteWarningComponent } from './../_components/delete-warning/delete-warning.component';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { getDiff, applyDiff, rdiffResult } from 'recursive-diff';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private userId;

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
    private authSetvice: AuthService,
    public dialog: MatDialog
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
  getRecordList(endpoint: string, query: string) {
    return this.http.get<any>(`${environment.backendUrl}/${endpoint}?${query}`)
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
    return this.http.post<any>(`${environment.backendUrl}/${endpoint}`, data)
    .pipe(map(settings => {
      return settings;
    }));
  }

    // Set the record data passing endpoint and Id
  updateRecordCustom(endpoint: string, data) {
      return this.http.post<any>(`${environment.backendUrl}/${endpoint}`, data)
      .pipe(map(settings => {
        return settings;
      }));
    }

  // Update Record Data
  updateRecord(endpoint: string, id: string, data) {
    return this.http.put<any>(`${environment.backendUrl}/${endpoint}/${id}`, data)
    .pipe(map(settings => {
      return settings;
    }));
  }

  deleteRecord(endpoint: string, id: string) {
    return this.http.delete(`${environment.backendUrl}/${endpoint}/${id}`)
    .pipe(map(res => {
      return res;
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


  createActivityRecord(servicesTemplates, newData, oriData) {
    const props = ['id', '_id', '__v', 'createdAt', 'updatedAt'];
    this.removeKeys(newData, props);
    this.removeKeys(oriData, props);

    console.log(oriData);
    console.log(newData);
    const recordChanges: any[] = [];

    Object.keys(oriData).forEach(key => {
      const newVal = newData[key];
      const oriVal = oriData[key];
      if (JSON.stringify(oriVal) !== JSON.stringify(newVal)) {
        if (Array.isArray(oriVal) || Array.isArray(newVal)) {

          oriVal.forEach(element => {
            if (!JSON.stringify(newVal).includes(JSON.stringify(element))) {
              recordChanges.push({key, oriVal: element.label, newVal: null});
            }
          });

          newVal.forEach(element => {
            if (!JSON.stringify(oriVal).includes(JSON.stringify(element))) {
              recordChanges.push({key, oriVal: null, newVal: element.label});
            }
          });

        } else {
          if (key !== '__v') { recordChanges.push({key, oriVal, newVal}); }
        }
      }
    });
    console.log(recordChanges);

    // const diff: rdiffResult[] = getDiff( oriData, newData, true);
    // console.log('diff', diff);
    // const final = applyDiff(newData, diff);
    // console.log('applydiff', final);

    this.http.post<any>(`${environment.backendUrl}/activities`, {
      subject: oriData ? 'Updated' : 'Created',
      body: 'body',
      user: this.userId,
      recordChanges,
      servicesTemplates,
    }).subscribe(res => console.log(res));
  }

  /**
   * Remove all specified keys from an object, no matter how deep they are.
   * The removal is done in place, so run it on a copy if you don't want to modify the original object.
   * This function has no limit so circular objects will probably crash the browser
   *
   * @param obj The object from where you want to remove the keys
   * @param keys An array of property names (strings) to remove
   */


  removeKeys(obj, keys) {
    let index;
    for (const prop in obj) {
        // important check that this is objects own property
        // not from prototype prop inherited
        if (obj.hasOwnProperty(prop)) {
            switch (typeof(obj[prop])) {
                case 'string':
                    index = keys.indexOf(prop);
                    if (index > -1) {
                        delete obj[prop];
                    }
                    break;
                case 'object':
                    index = keys.indexOf(prop);
                    if (index > -1) {
                        delete obj[prop];
                    } else {
                        this.removeKeys(obj[prop], keys);
                    }
                    break;
            }
        }
    }
  }


  /*
  Custom Requests
  */

 getTableDataColumns(contentType: string) {
  return this.http.get<any>(`${environment.backendUrl}/table-data-columns/${contentType}`)
  .pipe(map(settings => {
    return settings;
  }));
}

  // Get table data
  getTableData(contentType: string, model: string, query) {
    return this.http.get<any>(`${environment.backendUrl}/table-data/${contentType}/${model}?${query}`)
    .pipe(map(settings => {
      return settings;
    }));
  }

  // Set settings for individual user
  setUserSetting(data) {
    return this.http.put<any>(`${environment.backendUrl}/update-user/${this.userId}`, {userPreferences: data})
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
