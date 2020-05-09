import { SettingsPermissionsUserComponent } from './../../_components/settings-permissions-user/settings-permissions-user.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  @ViewChild('settingsPermissionsUser') settingsPermissionsUser: SettingsPermissionsUserComponent;
  permissions: any[];
  newPermissions: any[];
  sideBarOpened: boolean;
  editing = false;
  loading: boolean;
  module: string;
  contentType: string;
  contentTypeView: string;
  contentTypeEdit: string;
  isChanged: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  emptyPermissions = {users_view: 'All', users_edit: 'All', clients_view: 'All', clients_edit: 'All'};

  permissionsForm = new FormGroup({
    module: new FormControl(null, Validators.required)
  });

  constructor(
    private breakpointObserver: BreakpointObserver,
    private crud: CrudService
  ) { }

  ngOnInit(): void {
    this.isChanged = false;
    this.module = 'clients';
    this.contentTypeView = 'clients_view';
    this.contentTypeEdit = 'clients_edit';
    this.getUsersPermissions();
  }

  getUsersPermissions() {
    this.loading = true;
    this.crud.getRecordList('find-users-permissions').subscribe(res => {
      this.permissions = res;
      this.loading = false;
      console.log(res);
    });
    // this.crud.getRecordList('custom-permissions').subscribe(res => {
    //   this.permissions = res;
    //   this.loading = false;
    //   // this.newPermissions = res;
    //   console.log(this.permissions);
    // });
  }

  // changeUserPermission(e, type, item) {
  //   this.permissions = this.permissions.map(el => {
  //     if (el.id === item.id) {
  //       el.custom_permission[type] = e.value;
  //     }
  //     return el;
  //   });
  //   this.isChanged = true;
  // }

  editPermissions() {
    this.editing = true;
    // this.settingsPermissionsUser.editForm();
  }

  permissionsChanged(change) {
    const {formChanged, id, permissions} = change;
    this.isChanged = true;
    // If child permission component changed iterate through the original array and change the permission
    if (this.isChanged === true) {
      this.permissions = this.permissions.map(oriPerm => {
        const { userPermissions } = oriPerm;
        if (id === oriPerm.id) {
          oriPerm.userPermissions = userPermissions.map(perm => {
            if (perm.module === this.module) {
              perm.create = permissions.create;
              perm.view = permissions.view;
              perm.edit = permissions.edit;
              perm.delete = permissions.delete;
            }
            return perm;
          });
        }
        return oriPerm;
      });
    }

  }

  changeModule(e) {
    this.module = e.value;
  }

  cancel() {
    this.isChanged = false;
    this.editing = false;
    this.getUsersPermissions();
  }

  saveUserPermissions() {
    this.isChanged = false;
    this.loading = true;
    this.crud.createRecord('set-users-permissions', this.permissions).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.isChanged = false;
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
