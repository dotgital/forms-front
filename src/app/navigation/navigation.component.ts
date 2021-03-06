import { environment } from './../../environments/environment';
import { CrudService } from './../services/crud.service';
import { SearchService } from './../services/search.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;
  @ViewChild('search', {static: false}) searchInput: ElementRef;
  fullMenu: boolean;
  search: boolean;
  isHandset: boolean;
  isAdmin = false;
  userId: string;
  searchLoading: boolean;
  searchNoResults: boolean;
  searchValue: string;
  searchControl = new FormControl();
  options = [];
  searchUpdate = new Subject<string>();
  avatarUrl: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @HostListener('window:keydown', ['$event'])
  doSomething($event) {
    if ($event.key === 'k' && $event.ctrlKey === true) {
      this.toggleSearch();
    }
    if ($event.key === 'k' && $event.metaKey === true) {
      this.toggleSearch();
    }
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private searchService: SearchService,
    private router: Router,
    private crud: CrudService,
  ) {
    // this.search = false;
    this.isHandset$.subscribe(res => {
      this.isHandset = res;
    });
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(res => {
      this.isAdmin = res.user.role.type === 'administrator';
      this.userId = res.user.id;
    }).unsubscribe();
    this.search = false;
    this.searchUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        // if (value && value.trim() !== '') {
          this.searchLoading = true;
          this.searchValue = value;
          this.getAutocompleteSearch();
        // }
    });
    this.downloadUserAvatar();
  }

  downloadUserAvatar(){
    const query = `query {
      user(id: "${this.authService.currentUserValue.user.id}") {
        avatar{
            formats
        }
      }
    }`;
    this.crud.graphQl(query).subscribe(res => {
      this.avatarUrl = res.data.user.avatar ? `${environment.backendUrl}${res.data.user.avatar.formats.thumbnail.url}` : '../../assets/avatar.png';
    });
  }

  toggleSearch() {
    this.search = !this.search;
    if (this.search) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 1);
    } else {
      this.searchControl.reset();
    }
  }

  goTo(e) {
    const model = (e.model).toLowerCase();
    this.router.navigate([`/${model}s/${e.id}`]);
  }

  getAutocompleteSearch() {
    if (this.searchValue !== '' && this.searchValue !== null) {
      this.searchService.autocompleSearch(this.searchValue).subscribe(res => {
        this.searchLoading = false;
        this.options = res;
        if (res.length === 0) {
          this.searchNoResults = true;
          setTimeout(() => {
            this.searchNoResults = false;
          }, 1000);
        }
      });
    } else {
      this.searchLoading = false;
      this.options = [];
    }
  }

  resetSearch() {
    if (this.searchControl.value === null && this.searchValue === null) {
      this.search = !this.search;
    }
    this.searchControl.reset();
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
