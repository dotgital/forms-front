import { Router } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() model: string;
  @Input() contentType: string;
  @Input() columns: any[];
  @Input() settingsColumn: boolean;
  @Output() openRecord: EventEmitter<any> = new EventEmitter();
  @Output() openPreview: EventEmitter<any> = new EventEmitter();

  /* Table Sorting Properties */
  public startPage = 0;
  public pageSize = 10;
  public totalPages: number;
  public sortBy = 'createdAt';
  public sortDirection = 'desc';
  public custToolTip: string;

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
    if (this.contentType) {
      // this.getFields();
       this.getData();
    }
  }

  ngOnInit(): void {
    // this.getData();
  }

  getFields() {
      this.visibleColumns = this.columns.filter(col => col.tableVisible === true);
      this.dataColumns = this.visibleColumns.map(col => col.fieldName);
      this.getData();
  }

  getData() {
    const contentType = this.contentType;
    const model = this.model;
    const query = `_sort=${this.sortBy}:${this.sortDirection}&_start=${this.startPage}&_limit=${this.pageSize}`;
    // const columns = ['id', 'recordName'].concat(this.dataColumns);
    this.crud.getTableData(contentType, model, query).subscribe(res => {
      const dataColumns = res.dataColumns.filter(col => col !== 'id' && col !== 'recordName');
      if (this.settingsColumn) {
        this.tableColumns = [].concat('recordName', dataColumns, 'settings');
      } else {
        this.tableColumns = [].concat('recordName', dataColumns);
      }
      this.visibleColumns = res.columns;
      this.dataSource = new MatTableDataSource(res.entities);
      this.totalPages = res.count;
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
    this.openRecord.emit(row);
  }

  openRightPanel(row) {
    this.openPreview.emit(row);
  }

  isString(val): boolean {
    return typeof val === 'string';
  }

  showToolTip(e) {
    console.log(e);
    return 'returned &#13; toll tip';
  }
}
