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
  public startPage = 0;
  public pageSize = 10;
  public totalPages: number;
  public sortBy = 'createdAt';
  public sortDirection = 'desc';

  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['firstName', 'lastName'];

  constructor(
    private crud: CrudService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const where = `{}`;
    const query = `query{
      users (sort: "${this.sortBy}:${this.sortDirection}", start: ${this.startPage}, limit: ${this.pageSize}, where: ${where}){
        id
        ${this.displayedColumns}
      }
      usersConnection (where: ${where}) {
        aggregate {
            count
        }
    }
    }`;

    this.crud.getDatalist(query).subscribe(({data, loading}) => {
      this.dataSource = new MatTableDataSource(data.users);
      console.log(data)
      this.totalPages = data.usersConnection.aggregate.count;
      this.table.dataSource = this.dataSource;
    });
  }

  paginator(e) {
    this.startPage = e.pageIndex !== 0 ? e.pageIndex * e.pageSize : 0;
    this.pageSize = e.pageSize;
    this.getData();
  }

  sortData(e) {
    console.log(e);
    this.sortBy = e.active;
    this.sortDirection = e.direction;
    this.getData();
  }

  goTo(row) {
    this.router.navigate([`/clients/${row.id}`]);
  }
}
