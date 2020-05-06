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

  goBack() {
    this.location.back();
  }

  getRecordData() {
    this.loading = true;
    this.crud.getRecordData('users', this.record.id).subscribe(res => {
      this.record.title = res.recordName;
      this.record.data = res;
      this.creating = false;
      this.submit = 'disabled';
      this.avatarUrl = res.avatar ? `${environment.backendUrl}${res.avatar.formats.thumbnail.url}` : '../../../assets/avatar.png';
      this.loading = false;
    },
    err => {
      this.errorMessageService.showError('Record Not Found');
      this.router.navigate(['/users']);
    });
  }

  /*
  Buttons and chaild profile event listener
  */
  editRecord() {
    this.submit  = 'disabled';
    this.editing = true;
    this.userProfile.editForm();
  }

  cancelRecord() {
    this.editing = false;
    this.getRecordData();
  }

  saveRecord() {
    this.submit  = 'disabled';
    this.loading = true;
    this.userProfile.updateUser();
  }

  createRecord() {
    this.loading = true;
    // this.creating = false;
    this.userProfile.createUser();
  }

  profileChange(change){
    console.log(change)
    this.submit = change.formChanged ? 'enabled' : 'disabled';

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
        this.avatar.uploadAvatar(change.record.id);
      } else {
        this.loading = false;
      }
    } else if (change.dataUpdated === false){
      this.getRecordData();
    }
  }

  avatarChanged(e){
    if (!this.creating) {
      this.editRecord();
      this.submit  = 'enabled';
    }
    this.isAvatarChanged = true;
  }

  avatarUploaded(uploaded) {
    console.log(uploaded);
    if (uploaded) {
      this.isAvatarChanged = false;
      this.getRecordData();
    } else {
      this.loading = false;
    }
  }
}
