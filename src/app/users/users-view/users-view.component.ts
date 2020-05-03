import { UserProfileComponent } from './../components/user-profile/user-profile.component';
import { ErrorMessagesService } from 'src/app/services/error-messages.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  @ViewChild('userProfile') userProfile: UserProfileComponent;
  loading = true;
  editing: boolean;
  creating: boolean;
  disableSubmit: boolean;
  recordTitle: string;
  dateModified: string;
  dateCreated: string;
  createdBy: any;
  modifiedBy: any;
  sideBarOpened: boolean;
  record: any = {};
  recordData: any;

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

  ngAfterViewInit(): void {
    // this.userProfile.profileForm.valueChanges.subscribe(res => {
    //   console.log(res);
    // });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.record.id = params.get('id');
      if (this.record.id === 'add') {
        this.creating = true;
        this.recordData = '';
        this.recordTitle = 'New User';
        this.loading = false;
      } else {
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

  getRecordData() {
    this.loading = true;
    this.crud.getRecordData('users', this.record.id).subscribe(res => {
      this.recordTitle = res.recordName;
      const dateOptions = {hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' };
      this.dateModified = new Date(res.updatedAt).toLocaleString([], dateOptions);
      this.dateCreated = new Date(res.createdAt).toLocaleString([], dateOptions);
      this.createdBy = res.createdBy;
      this.modifiedBy = res.modifiedBy;
      // console.log(res)
      this.recordData = res;
      this.loading = false;
    },
    err => {
      this.errorMessageService.showError('Record Not Found');
      this.router.navigate(['/users']);
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

  dataChanged(e) {
    this.disableSubmit = e;
  }

  dataUpdated(e) {
    console.log(e);
    if (e.record && e.record.recordName) {
      this.recordTitle = e.record.recordName;
    }
    if ( e.err ) {
      this.getRecordData();
    }

    this.loading = e.loading;
  }

  dataCreated(e) {
    this.loading = e.loading;
    console.log(e);
    if ( e.dataCreated ) {
      this.loading = true;
      this.creating = false;
      this.record.id = e.recordId;
      this.location.go(`/users/${this.record.id}`);
      this.getRecordData();
    } else {
      this.creating = true;
    }
  }

  editRecord() {
    this.editing = !this.editing;
    this.userProfile.editForm();
  }

  cancelRecord() {
    this.editing = !this.editing;
    this.getRecordData();
    // this.userProfile.cancelForm();
  }

  saveRecord() {
    this.userProfile.updateUser();
  }

  createRecord() {
    this.creating = !this.creating;
    this.userProfile.createUser();
  }
}
