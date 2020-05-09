import { CrudService } from './../../services/crud.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-users-permissions',
  templateUrl: './users-permissions.component.html',
  styleUrls: ['./users-permissions.component.scss']
})
export class UsersPermissionsComponent implements OnInit, OnChanges {
  @Input() recordData: any;
  @Output() permissionsChange: EventEmitter<any> = new EventEmitter();
  public creating: boolean;
  public accessControl: any[] = [];
  private oriData: any;

  // defaultPermissions = [{module: 'Users'}, {module: 'Clients'}];

  constructor(
    private crud: CrudService,
  ) { }

  usersPermissions = new FormGroup({
    userType: new FormControl('authenticated', Validators.required),
    active: new FormControl('active', Validators.required),
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.creating = false;
    if ( this.recordData ) {
      this.accessControl = [];
      this.recordData.userPermissions.permissions.map(perm => {
        this.accessControl.push({
          module: perm.module,
          view: `${perm.module}View`,
          create: `${perm.module}Create`,
          edit: `${perm.module}Edit`,
          delete: `${perm.module}Delete`,
        });
        const formControl = new FormControl(null, Validators.required);
        this.usersPermissions.addControl(`${perm.module}Create`, new FormControl(perm.create, Validators.required));
        this.usersPermissions.addControl(`${perm.module}View`, new FormControl(perm.view, Validators.required));
        this.usersPermissions.addControl(`${perm.module}Edit`, new FormControl(perm.edit, Validators.required));
        this.usersPermissions.addControl(`${perm.module}Delete`, new FormControl(perm.delete, Validators.required));
      });
      this.oriData = this.usersPermissions.value;
      this.usersPermissions.disable();
    } else {
      this.creating = true;
    }
  }

  ngOnInit(): void {
    this.usersPermissions.valueChanges.subscribe(res => {
      if (this.oriData) {
        if (JSON.stringify(this.oriData) !== JSON.stringify(this.usersPermissions.value)) {
          this.permissionsChange.emit({formChanged: true});
        } else {
          this.permissionsChange.emit({formChanged: false});
        }
      }
    });
  }

  editForm() {
    this.usersPermissions.enable();
  }

  createUser() {
    console.log(this.usersPermissions.value);
  }

  updateUser() {
    console.log(this.usersPermissions.value);
    const request = this.formatRequest(this.usersPermissions.value);
    const id = this.recordData.id ? this.recordData.id : null;
    this.crud.updateRecord('update-user', id, request).subscribe(res => {
      console.log(res);
    });
  }

  formatRequest(data) {
    console.log(data);
    console.log(this.recordData);
    const permissions = this.recordData.userPermissions.permissions.map( perm => {
      perm.create = data[`${perm.module}Create`];
      perm.view = data[`${perm.module}View`];
      perm.edit = data[`${perm.module}Edit`];
      perm.delete = data[`${perm.module}Delete`];
      console.log(perm);
      return perm;
    });

    const users = {
      blocked: data.active === 'inactive',
      role: '5ea97551fc6ab6013c6e696f',
      userPermissions: {permissions}
    };
    return users;
  }
}
