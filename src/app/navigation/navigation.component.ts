import { SearchService } from './../services/search.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;
  fullMenu: boolean;
  search: boolean;
  isHandset: boolean;
  searchValue: string;
  myControl = new FormControl();
  options = [];
  searchUpdate = new Subject<string>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private searchService: SearchService,
    private router: Router,
  ) {
    this.search = false;
    this.isHandset$.subscribe(res => {
      this.isHandset = res;
    });
  }

  ngOnInit(){
    this.searchUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        console.log(value);
        this.searchValue = value;
        this.getAutocompleteSearch();
    });
  }

  getAutocompleteSearch() {
    if (this.searchValue != '') {
      this.searchService.autocompleSearch(this.searchValue).subscribe(res => {
        console.log(res);
        this.options = res;
      });
    } else {
      this.options = [];
    }
  }

  toggleMenu() {
    if (this.isHandset === true) {
      this.drawer.close();
    }
  }

  logout() {
    this.authService.logout();
  }
}
