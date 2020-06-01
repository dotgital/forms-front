import { ServicesTypeConfigComponent } from './../../_components/services-type-config/services-type-config.component';
import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-settings-services-templates',
  templateUrl: './settings-services-templates.component.html',
  styleUrls: ['./settings-services-templates.component.scss']
})
export class SettingsServicesTemplatesComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
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
    this.isHandset$.subscribe(res => {
      if (res) {
        this.sideBarOpened = false;
      } else {
        this.sideBarOpened = true;
      }
    });
  }

  changeColumns(e){
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

  openStatusConfig(record) {
    const dialogRef = this.dialog.open(ServicesTypeConfigComponent, {
      width: '500px',
      panelClass: 'filter-config',
      data: record.id
    });

    dialogRef.afterClosed().subscribe(result => {
      this.columnsChanged = !this.columnsChanged;
    });
  }

  openSidePreview(record) {
    this.rightSide.open();
    this.sideBarOpened = true;
    this.recordId = record.id;
    console.log(record);
  }
}
