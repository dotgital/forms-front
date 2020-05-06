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
    const module = this.module;
    const query = `_sort=${this.sortBy}:${this.sortDirection}&_start=${this.startPage}&_limit=${this.pageSize}`;
    const columns = ['id', 'recordName'].concat(this.dataColumns);
    this.crud.getTableData(module, query, columns).subscribe(res => {
      this.tableColumns = [].concat('recordName', this.dataColumns, 'settings');
      this.dataSource = new MatTableDataSource(res['entities']);
      this.totalPages = res['count'];
      this.table.dataSource = this.dataSource;
    });
  }

  paginator(e) {
    this.startPage = e.pageIndex !== 0 ? e.pageIndex * e.pageSize : 0;
    this.pageSize = e.pageSize;
    this.getData();
  }

  sortData(e) {
    if (e.direction) {
      this.sortBy = e.active;
      this.sortDirection = e.direction;
      this.getData();
    }
  }

  goTo(row) {
    this.router.navigate([`/clients/${row.id}`]);
  }

  isString(val): boolean {
    return typeof val === 'string';
  }
}
