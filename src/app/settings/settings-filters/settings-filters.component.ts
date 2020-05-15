import { FilterConfigComponent } from './filter-config/filter-config.component';
import { CrudService } from './../../services/crud.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-filters',
  templateUrl: './settings-filters.component.html',
  styleUrls: ['./settings-filters.component.scss']
})
export class SettingsFiltersComponent implements OnInit {
  allColumns = [];
  usersPrefId: string;

  constructor(
    private crud: CrudService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getFields();
  }

  getFields() {
    this.crud.getSettings('columns', 'filters').subscribe(res => {
      console.log(res);
      this.usersPrefId = res.usersPrefId;
      res.fields.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0));
      // this.allColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple');
      this.allColumns = res.fields;
    });
  }

  changeColumns(e) {
    this.getFields();
  }

  openFilterConfig() {
    const dialogRef = this.dialog.open(FilterConfigComponent, {
      width: '250px',
      panelClass: 'filter-config',
      data: {name: 'data'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
