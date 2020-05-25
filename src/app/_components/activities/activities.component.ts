import { CrudService } from './../../services/crud.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnChanges {
  @Input() recordId: string;
  @Input() contentType: string;
  activities: any[] = [];

  constructor(
    private crud: CrudService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ( this.recordId ) {
      console.log(this.recordId, this.contentType);
      this.getActivities();
    }
  }

  ngOnInit(): void {
    // this.getActivities();
  }

  getActivities() {
    const query = `_sort=createdAt:desc&${this.contentType}=${this.recordId}`;
    this.crud.getRecordList('activities', query).subscribe(res => {
      this.activities = res;
      console.log(res);
    });
  }
}
