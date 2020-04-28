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
  @Output() changeColumns = new EventEmitter<any>();
  selectedColumns: any[];
  loading: boolean;

  constructor(
    private settings: SettingsService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // this.selectedColumns = [this.columns[1]];
    if (this.columns) {
      this.loading = true;
      this.selectedColumns = this.columns.map((res, key) => res.tableVisible === true ? this.columns[key] : null );
      this.selectedColumns = ['name'].concat(this.selectedColumns);
    }
  }

  ngOnInit(): void {
    // this.selectedColumns = this.columns.map((res, key) => res.tableVisible === true ? this.columns[key] : null );
    // this.selectedColumns = ['name'].concat(this.selectedColumns);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  setColumns(e) {
    this.loading = true;
    console.log(this.selectedColumns);
    const data = this.selectedColumns.map(field => {
      const userPref = {
        // id: field.userFieldId,
        tableVisible: true,
        tablePosition: 0,
        fieldName: field.name
      };
      return userPref;
    });
    this.settings.setUserSetting(data).subscribe(res => {
      console.log(res);
      this.changeColumns.emit(this.selectedColumns);
    });
  }

}
