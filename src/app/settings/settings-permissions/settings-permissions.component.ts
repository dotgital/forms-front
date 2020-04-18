import { Permissions } from './../../_interfaces/permissions';
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
  permissions: any[];
  newPermissions: any[];
  sideBarOpened: boolean;
  loading: boolean;
  contentType: string;
  contentTypeView: string;
  contentTypeEdit: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  emptyPermissions = {users_view: 'All', users_edit: 'All', clients_view: 'All', clients_edit: 'All'};

  constructor(
    private breakpointObserver: BreakpointObserver,
    private crud: CrudService
  ) { }

  ngOnInit(): void {
    this.contentType = 'clients';
    this.contentTypeView = 'clients_view';
    this.contentTypeEdit = 'clients_edit';
    this.getUsersPermissions();
  }

  getUsersPermissions() {
    this.loading = true;
    this.crud.getUserPermissions(this.contentType).subscribe(res => {
      this.permissions = res;
      this.loading = false;
      // this.newPermissions = res;
      // console.log(this.permissions);
    });
  }

  changeUserPermission(e, type, item) {
    this.permissions = this.permissions.map(el => {
      if (el.id === item.id) {
        if (!el.custom_permission) {
          el.custom_permission = this.emptyPermissions;
        }
        el.custom_permission[type] = e.value;
      }
      return el;
    });
    console.log(this.permissions);
  }

  changeContentType(e) {
    this.contentType = e.value;
    this.contentTypeView = `${this.contentType}_view`;
    this.contentTypeEdit = `${this.contentType}_edit`;
  }

  saveUserPermissions() {
    this.crud.setUserPermissions(this.permissions).subscribe(res => {
      this.getUsersPermissions();
    });
  }

  toogleSideBar() {
    this.rightSide.toggle();
    if (this.rightSide.opened ) {
      this.sideBarOpened = true;
    } else {
      this.sideBarOpened = false;
    }
  }
}
