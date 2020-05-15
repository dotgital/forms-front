import { CrudService } from './../../services/crud.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
  encapsulation : ViewEncapsulation.None,
})
export class ColumnSelectorComponent implements OnInit, OnChanges {
  // @Input() columns: any[];
  @Input() contentType: string;
  // @Input() usersPrefId: string;
  @Output() changeColumns = new EventEmitter<any>();

  columns: any[];
  selectedColumns: any[];
  initialValues: any[];
  usersPrefId: string;
  loading: boolean;
  loadingHeight: number;
  loadingWidth: number;

  constructor(
    private crud: CrudService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.contentType) {
      this.getColumnsPreferences();
    }
    // this.selectedColumns = [this.columns[1]];
    // if (Array.isArray(this.columns) && this.columns.length) {
    //   // this.initialValues = this.columns.map(col => {
    //   //   const val = {
    //   //     id: col.id,
    //   //     module: this.module,
    //   //     tableVisible: col.tableVisible ? true : false,
    //   //     tablePosition: col.tablePosition,
    //   //     fieldName: col.fieldName
    //   //   };
    //   //   return val;
    //   // });
    //   this.initialValues = this.columns;
    //   this.loadingWidth = 280;
    //   this.loadingHeight = (this.columns.length * 48) + 16;
    //   this.selectedColumns = this.initialValues.map((res, key) => res.tableVisible === true ? this.columns[key] : null );
    //   setTimeout(() => {
    //     this.loading = false;
    //   }, 100);
    // }
  }

  ngOnInit(): void {
  }

  getColumnsPreferences() {
    this.crud.getTableDataColumns(this.contentType).subscribe(res => {
      this.columns = res.columns.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0));
      this.usersPrefId = res.usersPrefId;
      this.initialValues = res.columns;
      this.loadingWidth = 280;
      this.loadingHeight = (res.columns.length * 48) + 16;
      this.selectedColumns = this.initialValues.map((col, key) => col.tableVisible === true ? this.columns[key] : null );
      setTimeout(() => {
        this.loading = false;
      }, 100);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.initialValues, event.previousIndex, event.currentIndex);
    this.setOrder();
  }

  setOrder() {
    this.loading = true;
    this.initialValues = this.initialValues.map((field, key) => {
      field.tablePosition = key;
      return field;
    });
    this.columns = this.initialValues;
    this.savePref();
  }

  setVisible() {
    this.loading = true;
    this.initialValues = this.initialValues.map(field => {
      field.tableVisible = false;
      if ( this.selectedColumns.some(selected => selected.fieldName === field.fieldName) ) {
        field.tableVisible = true;
      }
      return field;
    });
    this.savePref();
  }

  savePref() {
    const data: {} = {};
    const listView = `${this.contentType}ListView`;
    data['id'] = this.usersPrefId;
    data[listView] = this.initialValues;
    console.log(data);
    this.crud.setUserSetting(data).subscribe(res => {
      // console.log(res);
      this.loading = false;
      this.changeColumns.emit(this.selectedColumns);
    });
  }

}
