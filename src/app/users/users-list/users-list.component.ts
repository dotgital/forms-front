import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { CrudService } from './../../services/crud.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  columnsChanged: boolean;

  // allColumns: any[];
  // usersPrefId: string;
  isAdmin = false;

  constructor(
    // private crud: CrudService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      this.isAdmin = res.user.role.type === 'administrator';
    });
    // this.getFields();
  }

  // getFields() {
  //   this.crud.getSettings('columns', 'users').subscribe(res => {
  //     this.usersPrefId = res.usersPrefId;
  //     res.fields.sort((a, b) => (a.tablePosition > b.tablePosition) ? 1 : ((b.tablePosition > a.tablePosition) ? -1 : 0));
  //     this.allColumns = res.fields.filter(col => col.fieldType !== 'dropdown-multiple');
  //   });
  // }

  openRecord(event) {
    this.router.navigate([`/users/${event.id}`]);
  }

  changeColumns(e) {
    this.columnsChanged = !this.columnsChanged;
  }
}
