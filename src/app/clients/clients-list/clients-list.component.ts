import { Router } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  columnsChanged: boolean;
  // allColumns = [];
  // usersPrefId: string;

  constructor(
    private crud: CrudService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // this.getFields();
  }

  // getFields() {
  //   this.crud.getSettings('columns', 'clients').subscribe(res => {
  //     console.log(res)
  //     this.usersPrefId = res.usersPrefId;
  //     res.fields.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0));
  //     // this.allColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple');
  //     this.allColumns = res.fields;
  //   });
  // }

  openRecord(event) {
    this.router.navigate([`/clients/${event.id}`]);
  }

  changeColumns(e){
    this.columnsChanged = !this.columnsChanged;
  }
}
