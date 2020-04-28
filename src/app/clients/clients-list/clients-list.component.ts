import { SettingsService } from './../../services/settings.service';
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
  public pageSize = 10;
  public totalPages: number;
  public sortBy = 'createdAt';
  public sortDirection = 'desc';

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: MatTableDataSource<any>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  allColumns = [];
  visibleColumns = [];
  tableColumns = [];
  dataColumns = [];

  constructor(
    private crud: CrudService,
    private router: Router,
    private settings: SettingsService,
  ) {}

  ngOnInit() {
    this.getFields();
    // this.dataSource = new ListDataSource();
  }

  getFields() {
    this.settings.getSettings('columns', 'clients').subscribe(res => {
      console.log(res);
      // this.tableColumns = [].concat(this.dataColumns, 'settings');
      this.allColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple');
      this.visibleColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple' && col.tableVisible === true);
      this.dataColumns = this.visibleColumns.map(col => col.name);
      // this.dataColumns = ["firstName", "lastName", "phoneMobile", "status"];
      // this.visibleColumns = res.fields;
      this.getData();
      // this.getData();
    });
  }

  getData() {
    const where = `{}`;
    const query = `query{
      clients (sort: "${this.sortBy}:${this.sortDirection}", start: ${this.startPage}, limit: ${this.pageSize}, where: ${where}){
        id
        recordName
        ${this.dataColumns}
      }
      clientsConnection (where: ${where}) {
        aggregate {
            count
        }
    }
    }`;

    this.crud.getDatalist(query).subscribe(({data, loading}) => {
      this.tableColumns = [].concat('recordName', this.dataColumns, 'settings');
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

  changeColumns(e){
    console.log(e);
    this.getFields();
    // this.settings.setColumnsPreference(e);
  }
}
