import { AuthService } from './../../services/auth.service';
import { UsersPermissionsComponent } from './../users-permissions/users-permissions.component';
import { environment } from './../../../environments/environment';
import { AvatarComponent } from './../../_components/avatar/avatar.component';
import { UserProfileComponent } from './../components/user-profile/user-profile.component';
import { ErrorMessagesService } from 'src/app/services/error-messages.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  @ViewChild('userProfile') userProfile: UserProfileComponent;
  @ViewChild('userPemissions') userPermissions: UsersPermissionsComponent;
  @ViewChild('avatar') avatar: AvatarComponent;

  avatarUrl: any;
  isAvatarChanged: boolean;
  isAdmin = false;

  profileValid: boolean;
  permissionsValid: boolean;

  loading = true;
  editing: boolean;
  creating: boolean;
  disabledSubmit: boolean;

  record: any = {
    id: '',
    title: 'New User',
    data: null,
    newData: {},
  };

  sideBarOpened: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private crud: CrudService,
    private location: Location,
    private errorMessageService: ErrorMessagesService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUserValue.user.role.type === 'administrator';
    this.route.paramMap.subscribe(params => {
      if (params.get('id') === 'add') {
        this.creating = true;
        this.loading = false;
      } else {
        this.record.id = params.get('id');
        this.getRecordData();
      }
    });

    this.isHandset$.subscribe(res => {
      if (res) {
        this.sideBarOpened = false;
      } else {
        this.sideBarOpened = true;
      }
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

  goBack() {
    this.location.back();
  }

  getRecordData() {
    this.loading = true;
    this.crud.getRecordData('find-one-user', this.record.id).subscribe(res => {
      this.record.title = res.recordName;
      this.record.data = res;
      this.creating = false;

      // Reset Avatar when cancel form
      this.avatarUrl = '../../../assets/avatar.png';
      this.avatarUrl = res.avatar ? `${environment.backendUrl}${res.avatar.formats.thumbnail.url}` : '../../../assets/avatar.png';
      this.loading = false;
    },
    err => {
      this.errorMessageService.showError('Record Not Found');
      this.router.navigate(['/users']);
    });
  }

  /*
  Listener to send event to the child components
  */
  editRecord() {
    this.editing = true;
    this.userProfile.editForm();
    if (this.isAdmin) { this.userPermissions.editForm(); }
  }

  cancelRecord() {
    this.editing = false;
    this.avatarUrl = '';
    this.getRecordData();
  }

  saveRecord() {
    this.loading = true;
    this.userProfile.checkIfValid();
    this.userPermissions.checkIfValid();
  }

  createRecord() {
    this.loading = true;
    this.userProfile.checkIfValid();
    this.userPermissions.checkIfValid();
  }

  /*
  Listener for evenemiter from users profile child component
  */

  userChanges(change) {
    console.log(change)
    if (!change.error) {
      Object.keys(change.data).map(prop => {
        if (change.data[prop] !== null && change.data[prop] !== 'undefined') {
          this.record.newData[prop] = change.data[prop];
        }
      });

      this.permissionsValid = change.permissionsValid ? change.permissionsValid : this.permissionsValid;
      this.profileValid = change.profileValid ? change.profileValid : this.profileValid ;
      if (this.profileValid && this.permissionsValid) {
        if (this.record.id === '' && this.record.newData) {
          this.createUserProfile();
        } else {
          this.updateUserProfile();
        }
      }
    } else {
      this.loading = false;
    }
  }

  avatarChanges(change) {
    console.log(change);
    if (change.avatarChanged) {
      this.isAvatarChanged = true;
      if (this.record.id) {
        this.editing = true;
      }
    }

    if (change.avatarUpdated) {
      this.isAvatarChanged = false;
      this.loading = false;
      this.creating = false;
      this.editing = false;
    }
  }

  createUserProfile() {
    this.crud.createRecord('users', this.record.newData).subscribe(record => {
      this.record.title = record.recordName;
      if (this.isAvatarChanged) {
        this.avatar.uploadAvatar(record.id);
      } else {
        this.loading = false;
        this.creating = false;
      }
      this.location.go(`/users/${record.id}`);
    }, err => {
      if (err[0].messages[0].field.includes('username')) {
        this.errorMessageService.showError('This email address is already taken');
      }
      console.log(err);
    });
  }

  updateUserProfile() {
    this.crud.updateRecord('update-user', this.record.id, this.record.newData).subscribe(record => {
      this.record.title = record.recordName;
      if (this.isAvatarChanged) {
        this.avatar.uploadAvatar(this.record.id);
      } else {
        this.loading = false;
        this.editing = false;
      }
    }, err => {
      console.log(err);
      this.errorMessageService.showError('Error updating this user profile');
    });
  }
}
