import { ServicesTypeSelectorComponent } from './../../_components/services-type-selector/services-type-selector.component';
import { ServicesTypeConfigComponent } from '../../_components/services-type-config/services-type-config.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from './../../../environments/environment';
import { AvatarComponent } from './../../_components/avatar/avatar.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { UiService } from './../../services/ui.service';
import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CrudService } from './../../services/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { ErrorMessagesService } from 'src/app/services/error-messages.service';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClientsViewComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  @ViewChild('clientProfile') clientProfile: ClientProfileComponent;
  @ViewChild('avatar') avatar: AvatarComponent;

  avatarUrl: any;
  isAvatarChanged: boolean;
  isAdmin = false;
  profileValid: any;
  services: any[] = [];
  serviceId: string;

  loading = true;
  editing: boolean;
  creating: boolean;
  disableSubmit: boolean;
  create: boolean;
  recordTitle: string;
  dateModified: string;
  dateCreated: string;
  createdBy: any;
  modifiedBy: any;
  sideBarOpened: boolean;

  record: any = {
    id: '',
    title: 'New Client',
    data: null,
    newData: {},
  };

  recordData: {};

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private crud: CrudService,
    private ui: UiService,
    private location: Location,
    private errorMessageService: ErrorMessagesService,
    public dialog: MatDialog,
  ) { }

  ngAfterViewInit(): void {
    // this.userProfile.profileForm.valueChanges.subscribe(res => {
    //   console.log(res);
    // });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('caseId');
      console.log(this.serviceId);
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

  getRecordData() {
    this.loading = true;
    this.crud.getRecordData('clients', this.record.id).subscribe(res => {
      this.services = res.services;
      console.log(res);
      this.record.title = `${res.firstName} ${res.lastName}`;

      // Reset Avatar when cancel form
      this.avatarUrl = '../../../assets/avatar.png';
      this.avatarUrl = res.avatar ? `${environment.backendUrl}${res.avatar.formats.thumbnail.url}` : '../../../assets/avatar.png';

      const dateOptions = {hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' };
      this.dateModified = new Date(res.updatedAt).toLocaleString([], dateOptions);
      this.dateCreated = new Date(res.createdAt).toLocaleString([], dateOptions);
      this.createdBy = res.createdBy;
      this.modifiedBy = res.modifiedBy;
      this.record.data = res;
      this.loading = false;
    },
    err => {
      this.errorMessageService.showError('Record Not Found');
      this.router.navigate(['/clients']);
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

  editRecord() {
    this.editing = true;
    this.clientProfile.editForm();
    // this.clientProfile.enableForm();
  }

  cancelRecord() {
    this.editing = !this.editing;
    this.getRecordData();
    // this.clientProfile.cancelForm();
  }

  saveRecord() {
    this.loading = true;
    this.clientProfile.checkIfValid();
  }

  createRecord() {
    this.loading = true;
    this.clientProfile.checkIfValid();
    // this.clientProfile.createClient();
  }

  changeService(service) {
    console.log(service.value);
    this.router.navigate([`/clients/${this.record.id}/case/${service.value.id}`]);
  }

  clientChanges(change) {
    console.log(change)
    if (!change.error) {
      Object.keys(change.data).map(prop => {
        if (change.data[prop] !== null && change.data[prop] !== 'undefined') {
          this.record.newData[prop] = change.data[prop];
        }
      });

      this.profileValid = change.profileValid ? change.profileValid : this.profileValid ;
      if (this.profileValid) {
        if (this.record.id === '' && this.record.newData) {
          this.createClientProfile();
        } else {
          this.updateClientProfile();
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
      this.editing = false;
    }
  }

  createClientProfile() {
    console.log(this.record.newData);
    this.crud.createRecord('clients', this.record.newData).subscribe(record => {
      this.record.title = record.recordName;
      this.record.data = record;
      this.creating = false;
      if (this.isAvatarChanged) {
        this.avatar.uploadAvatar(record.id);
      } else {
        this.loading = false;
      }
      this.location.go(`/clients/${record.id}`);
    }, err => {
      this.loading = false;
      this.creating = false;
      console.log(err);
    });
  }

  updateClientProfile() {
    this.crud.updateRecord('clients', this.record.id, this.record.newData).subscribe(record => {
      this.record.title = record.recordName;
      if (this.isAvatarChanged) {
        this.avatar.uploadAvatar(this.record.id);
      } else {
        this.loading = false;
        this.editing = false;
      }
    }, err => {
      console.log(err);
      this.loading = false;
      this.editing = false;
      this.errorMessageService.showError('Error updating this client profile');
    });
  }


  addService() {
    console.log('ser');
    const dialogRef = this.dialog.open(ServicesTypeSelectorComponent, {
      // width: '250px',
      panelClass: 'service-type-selector',
      data: this.record.id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
