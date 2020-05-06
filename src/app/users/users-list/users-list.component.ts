import { CrudService } from './../../services/crud.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  allColumns: any[];
  usersPrefId: string;

  constructor(
    private crud: CrudService
  ) { }

  ngOnInit(): void {
    this.getFields();
  }

  getFields() {
    this.crud.getSettings('columns', 'users').subscribe(res => {
      this.usersPrefId = res.usersPrefId;
      res.fields.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0));
      this.allColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple');
    });
  }

  changeColumns(e){
    this.getFields();
  }
}
