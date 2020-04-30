import { UiService } from './../../services/ui.service';
import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CrudService } from './../../services/crud.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.scss']
})
export class ClientsViewComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  loading = true;
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
    private crud: CrudService,
    private ui: UiService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.record.id = params.get('id');
      if (this.record.id !== 'add') {
        this.getRecordData();
      } else {
        this.recordData = '';
        this.recordTitle = 'New Client';
        this.loading = false;
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
      const dateOptions = {hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }
      this.dateModified = new Date(res.updatedAt).toLocaleString([], dateOptions);
      this.dateCreated = new Date(res.createdAt).toLocaleString([], dateOptions);
      this.createdBy = res.createdBy;
      this.modifiedBy = res.modifiedBy;
      // console.log(res)
      this.recordData = res;
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

  goBack() {
    this.location.back();
  }

}
