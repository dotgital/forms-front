import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  loading = true;
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
    this.crud.getRecordData('users', this.record.id).subscribe(res => {
      console.log(res);
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

}
