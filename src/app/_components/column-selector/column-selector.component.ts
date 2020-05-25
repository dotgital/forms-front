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
      this.getUserSettingColumns();
    }
  }

  ngOnInit(): void {
  }

  getUserSettingColumns() {
    const query = `contentType=${this.contentType}`;
    this.crud.getRecordList('settings-columns', query).subscribe(res => {
      this.columns = res.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0))
      this.loadingWidth = 280;
      this.loadingHeight = (res.length * 48) + 16;
      this.initialValues = res;
      this.selectedColumns = this.initialValues.map((col, key) => col.tableVisible === true ? res[key] : null );
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
    this.crud.createRecord('settings-columns', this.initialValues).subscribe(res => {
      this.loading = false;
      this.changeColumns.emit(this.selectedColumns);
    });
  }

}
