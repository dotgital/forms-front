import { SettingsFieldsModalComponent } from './../../_components/settings-fields-modal/settings-fields-modal.component';
import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-settings-fields',
  templateUrl: './settings-fields.component.html',
  styleUrls: ['./settings-fields.component.scss']
})
export class SettingsFieldsComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  filter: string;
  contentTypes: any[] = [{key: 'clients', label: 'Clients'}, {key: 'services', label: 'Service Info'}];
  columnsChanged: boolean;
  sideBarOpened: boolean;
  recordId: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.filter = 'contentType_in=clients&contentType_in=services';
    this.isHandset$.subscribe(res => {
      if (res) {
        this.sideBarOpened = false;
      } else {
        this.sideBarOpened = true;
      }
    });
  }

  changeColumns(e) {
    this.columnsChanged = !this.columnsChanged;
  }

  toogleSideBar() {
    this.rightSide.toggle();
    if (this.rightSide.opened ) {
      this.sideBarOpened = true;
    } else {
      this.sideBarOpened = false;
    }
  }

  switchContentType(item) {
    this.filter = `contentType=${item.value}`;
  }

  openStatusConfig(record) {
    const dialogRef = this.dialog.open(SettingsFieldsModalComponent, {
      width: '250px',
      panelClass: 'fields-config',
      data: record.id
    });

    dialogRef.afterClosed().subscribe(result => {
      this.columnsChanged = !this.columnsChanged;
    });
  }

}
