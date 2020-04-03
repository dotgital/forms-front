import { Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
// import { ListDataSource, ListItem } from './list-datasource';


@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {

  public startPage = 0;
  public pageSize = 5;
  public totalPages: number;
  public sortBy = 'createdAt';
  public sortDirection = 'desc';

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: MatTableDataSource<any>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['firstName', 'lastName'];

  constructor(
    private crud: CrudService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getData();
    // this.dataSource = new ListDataSource();
  }

  getData() {
    const where = `{}`;
    const query = `query{
      clients (sort: "${this.sortBy}:${this.sortDirection}", start: ${this.startPage}, limit: ${this.pageSize}, where: ${where}){
        id
        ${this.displayedColumns}
      }
      clientsConnection (where: ${where}) {
        aggregate {
            count
        }
    }
    }`;

    this.crud.getDatalist(query).subscribe(({data, loading}) => {
      this.dataSource = new MatTableDataSource(data.clients);
      // this.dataSource.sort = this.sort;
      this.totalPages = data.clientsConnection.aggregate.count;
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
