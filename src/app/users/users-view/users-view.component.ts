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

  loading = true;
  editing: boolean;
  creating: boolean;
  submit: string;
  disabledSubmit: boolean;

  // recordTitle: string;
  record: any = {
    id: '',
    title: 'New User',
    data: null
  };

  // recordData: any;

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
  ) { }

  ngOnInit(): void {
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

  selectedTabChange(e){
    console.log(e);
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
      this.submit = 'disabled';

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
    this.submit  = 'disabled';
    this.editing = true;
    this.userProfile.editForm();
    this.userPermissions.editForm();
  }

  cancelRecord() {
    this.editing = false;
    this.avatarUrl = '';
    this.getRecordData();
  }

  saveRecord() {
    this.submit = 'disabled';
    this.userProfile.updateUser();
    this.userPermissions.updateUser();
  }

  createRecord() {
    this.userProfile.createUser();
    this.userPermissions.createUser();
  }

  /*
  Listener for evenemiter from users profile child component
  */

  profileChange(change){
    this.submit = change.formChanged || change.formValid === false ? 'enabled' : 'disabled';

    this.loading = change.formValid ? true : false;

    if (change.dataCreated && this.isAvatarChanged) {
      this.record.id = change.recordId;
      this.avatar.uploadAvatar({id: this.record.id});
    } else if (change.dataCreated && !this.isAvatarChanged) {
      this.getRecordData();
    } else if (change.dataCreated === false) {
      this.loading = false;
      this.creating = true;
    }

    if (change.dataUpdated === true) {
      this.record.title = change.record.recordName;
      if (this.isAvatarChanged) {
        this.avatar.uploadAvatar(change.record);
      } else {
        this.loading = false;
      }
    } else if (change.dataUpdated === false){
      this.getRecordData();
    }
  }

  /*
  Listeners for EventEmitter from Avatar child Comopoent
  */

  avatarChanged(e){
    if (!this.creating) {
      this.editRecord();
      this.submit  = 'enabled';
    }
    this.isAvatarChanged = true;
  }

  avatarUploaded(uploaded) {
    if (uploaded) {
      this.isAvatarChanged = false;
      this.getRecordData();
    } else {
      this.loading = false;
    }
  }

  /*
  Listeners for EventEmmiter from UsersPermissionsComponent
  */
 permissionsChange(change){
  this.submit = change.formChanged || change.formValid === false ? 'enabled' : 'disabled';
  console.log(change);
 }
}
