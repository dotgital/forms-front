import { SettingsService } from './../../services/settings.service';
import { Router } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  allColumns: any[];
  usersPrefId: string;

  constructor(
    private settings: SettingsService,
  ) { }

  ngOnInit(): void {
    this.getFields();
  }

  getFields() {
    this.settings.getSettings('columns', 'users').subscribe(res => {
      this.usersPrefId = res.usersPrefId;
      res.fields.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0));
      this.allColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple');
    });
  }

  changeColumns(e){
    this.getFields();
    // this.settings.setColumnsPreference(e);
  }
}
