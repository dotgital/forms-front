import { SettingsService } from './../../services/settings.service';
import { Router } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() module: string;
  @Input() columns: any[];

  /* Table Sorting Properties */
  public startPage = 0;
  public pageSize = 10;
  public totalPages: number;
  public sortBy = 'createdAt';
  public sortDirection = 'desc';

  /* Columns Properties */
  visibleColumns = [];
  tableColumns = [];
  dataColumns = [];

  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: MatTableDataSource<any>;

  constructor(
    private crud: CrudService,
    private router: Router,
    private settings: SettingsService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (Array.isArray(this.columns) && this.columns.length) {
      this.getFields();
    }
  }

  ngOnInit(): void {
  }

  getFields() {
      this.visibleColumns = this.columns.filter(col => col.tableVisible === true);
      this.dataColumns = this.visibleColumns.map(col => col.fieldName);
      this.getData();
  }

  getData() {
    const where = `{}`;
    const query = `query{
      ${this.module} (sort: "${this.sortBy}:${this.sortDirection}", start: ${this.startPage}, limit: ${this.pageSize}, where: ${where}){
        id
        recordName
        ${this.dataColumns}
      }
      ${this.module}Connection (where: ${where}) {
        aggregate {
            count
        }
    }
    }`;
    this.crud.getDatalist(query).subscribe(({data, loading}) => {
      const connection = `${this.module}Connection`;
      this.tableColumns = [].concat('recordName', this.dataColumns, 'settings');
      this.dataSource = new MatTableDataSource(data[this.module]);
      this.totalPages = data[connection].aggregate.count;
      this.table.dataSource = this.dataSource;
    });
  }

  paginator(e) {
    this.startPage = e.pageIndex !== 0 ? e.pageIndex * e.pageSize : 0;
    this.pageSize = e.pageSize;
    this.getData();
  }

  sortData(e) {
    console.log(e)
    if (e.direction) {
      this.sortBy = e.active;
      this.sortDirection = e.direction;
      this.getData();
    }
  }

  goTo(row) {
    this.router.navigate([`/clients/${row.id}`]);
  }
}
