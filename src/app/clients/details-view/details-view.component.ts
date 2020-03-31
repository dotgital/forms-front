import { CrudService } from './../../services/crud.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.scss']
})
export class DetailsViewComponent implements OnInit {

  loading = true;
  recordTitle: string;
  record = {
    id: '',
    type: 'clients'
  };
  recordData: {};
  items = ['Immigration', 'Family'];

  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.record.id = params.get('id');
      this.getRecordData();
    });
  }

  getRecordData() {
    this.crud.getRecordData(this.record.type, this.record.id).subscribe(res => {
      this.recordTitle = `${res.firstName} ${res.lastName}`;
      this.recordData = res;
      // console.log(this.recordData);
      this.loading = false;
    });
  }
}
