import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { UiService } from './../../services/ui.service';
import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CrudService } from './../../services/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { ErrorMessagesService } from 'src/app/services/error-messages.service';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.scss']
})
export class ClientsViewComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  @ViewChild('clientProfile') clientProfile: ClientProfileComponent;
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
  record = {
    id: '',
    type: 'clients'
  };
  recordData: {};
  items = ['Immigration', 'Family'];

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
        this.create = true;
        this.creating = true;
        this.recordData = '';
        this.recordTitle = 'New Client';
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
    this.crud.getRecordData(this.record.type, this.record.id).subscribe(res => {
      this.recordTitle = `${res.firstName} ${res.lastName}`;
      const dateOptions = {hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' };
      this.dateModified = new Date(res.updatedAt).toLocaleString([], dateOptions);
      this.dateCreated = new Date(res.createdAt).toLocaleString([], dateOptions);
      this.createdBy = res.createdBy;
      this.modifiedBy = res.modifiedBy;
      this.recordData = res;
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

  dataChanged(e) {
    this.disableSubmit = e;
  }

  dataUpdated(e) {
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
      this.create = false;
      this.record.id = e.recordId;
      this.location.go(`/clients/${this.record.id}`);
      this.getRecordData();
    } else {
      this.creating = true;
    }
  }

  editRecord() {
    this.editing = !this.editing;
    this.clientProfile.enableForm();
  }

  cancelRecord() {
    this.editing = !this.editing;
    this.getRecordData();
    // this.clientProfile.cancelForm();
  }

  saveRecord() {
    this.clientProfile.updateClient();
  }

  createRecord() {
    this.creating = !this.creating;
    this.clientProfile.createClient();
  }

}
