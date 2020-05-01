import { SettingsService } from './../../services/settings.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
  encapsulation : ViewEncapsulation.None,
})
export class ColumnSelectorComponent implements OnInit, OnChanges {
  @Input() columns: any[];
  @Input() module: string;
  @Input() usersPrefId: string;
  @Output() changeColumns = new EventEmitter<any>();

  selectedColumns: any[];
  initialValues: any[];
  loading: boolean;
  loadingHeight: number;
  loadingWidth: number;

  constructor(
    private settings: SettingsService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // this.selectedColumns = [this.columns[1]];
    if (Array.isArray(this.columns) && this.columns.length) {
      // this.initialValues = this.columns.map(col => {
      //   const val = {
      //     id: col.id,
      //     module: this.module,
      //     tableVisible: col.tableVisible ? true : false,
      //     tablePosition: col.tablePosition,
      //     fieldName: col.fieldName
      //   };
      //   return val;
      // });
      this.initialValues = this.columns;
      this.loadingWidth = 280;
      this.loadingHeight = (this.columns.length * 48) + 16;
      this.selectedColumns = this.initialValues.map((res, key) => res.tableVisible === true ? this.columns[key] : null );
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  }

  ngOnInit(): void {
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
    const listView = `${this.module}ListView`;
    data['id'] = this.usersPrefId;
    data[listView] = this.initialValues;
    console.log(data);
    this.settings.setUserSetting(data).subscribe(res => {
      this.changeColumns.emit(this.selectedColumns);
    });
  }

}
