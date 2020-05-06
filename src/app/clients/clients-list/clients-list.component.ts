import { CrudService } from './../../services/crud.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  allColumns = [];
  usersPrefId: string;

  constructor(
    private crud: CrudService,
  ) {}

  ngOnInit(): void {
    this.getFields();
  }

  getFields() {
    this.crud.getSettings('columns', 'clients').subscribe(res => {
      this.usersPrefId = res.usersPrefId;
      res.fields.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0));
      // this.allColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple');
      this.allColumns = res.fields;
    });
  }

  changeColumns(e){
    this.getFields();
  }
}
