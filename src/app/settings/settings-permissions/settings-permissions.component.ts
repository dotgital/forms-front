import { CrudService } from './../../services/crud.service';
import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-settings-permissions',
  templateUrl: './settings-permissions.component.html',
  styleUrls: ['./settings-permissions.component.scss']
})
export class SettingsPermissionsComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  permissions: [] = [];
  sideBarOpened: boolean;
  loading: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private crud: CrudService
  ) { }

  ngOnInit(): void {
    this.getUsersPermissions();
  }

  getUsersPermissions() {
    this.loading = true;
    const query = `query{
      users{
        id
        firstName
        lastName
        customPermissions{
          id
          contentTypeName
          view
          edit
        }
      }
    }`;
    this.crud.getDatalist(query).subscribe(res => {
      this.permissions = res.data.users;
      console.log(res);
      this.loading = false;
    });
  }

  toogleSideBar(){
    this.rightSide.toggle()
    if (this.rightSide.opened ){
      this.sideBarOpened = true;
    } else {
      this.sideBarOpened = false;
    }
  }

}
