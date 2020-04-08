import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CrudService } from './../../services/crud.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.scss']
})
export class ClientsViewComponent implements OnInit {
  loading = true;
  recordTitle: string;
  record = {
    id: '',
    type: 'clients'
  };
  recordData: {};
  items = ['Immigration', 'Family'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private crud: CrudService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.record.id = params.get('id');
      if (this.record.id !== 'add') {
        this.getRecordData();
      } else {
        this.recordData = '';
        this.recordTitle = 'New Client';
        this.loading = false;
      }
    });
  }

  getRecordData() {
    this.crud.getRecordData(this.record.type, this.record.id).subscribe(res => {
      this.recordTitle = `${res.firstName} ${res.lastName}`;
      this.recordData = res;
      this.loading = false;
    });
  }
}
