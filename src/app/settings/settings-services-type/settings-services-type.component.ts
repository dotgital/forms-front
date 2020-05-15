import { ServicesTypeConfigComponent } from './services-type-config/services-type-config.component';
import { MatDialog } from '@angular/material/dialog';
import { CrudService } from './../../services/crud.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-services-type',
  templateUrl: './settings-services-type.component.html',
  styleUrls: ['./settings-services-type.component.scss']
})
export class SettingsServicesTypeComponent implements OnInit {
  // allColumns = [];
  columnsChanged: boolean;

  constructor(
    private crud: CrudService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // this.getServicesType();
  }

  // getServicesType() {
  //   this.crud.getSettings('servicesTypes', '').subscribe(res => {
  //     this.allColumns = res.servicesTypes;
  //   });
  // }

  changeColumns(e){
    this.columnsChanged = !this.columnsChanged;
  }

  openStatusConfig(record){
    const dialogRef = this.dialog.open(ServicesTypeConfigComponent, {
      width: '250px',
      panelClass: 'filter-config',
      data: record
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
