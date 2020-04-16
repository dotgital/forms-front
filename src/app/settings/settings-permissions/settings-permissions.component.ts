import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-settings-permissions',
  templateUrl: './settings-permissions.component.html',
  styleUrls: ['./settings-permissions.component.scss']
})
export class SettingsPermissionsComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  sideBarOpened: boolean;
  loading: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
  }

  toogleSideBar(){
    this.rightSide.toggle()
    if (this.rightSide.opened ){
      this.sideBarOpened = true;
    } else {
      this.sideBarOpened = false;
    }
  }

}
