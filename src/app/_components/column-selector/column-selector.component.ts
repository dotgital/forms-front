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

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // this.selectedColumns = [this.columns[1]];
    this.selectedColumns = this.columns.map((res, key) => res.tableVisible === true ? this.columns[key] : null );
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  setColumns(e){
    this.changeColumns.emit(e);
  }

}
