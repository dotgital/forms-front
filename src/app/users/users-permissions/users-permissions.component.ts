import { ErrorMessagesService } from './../../services/error-messages.service';
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
  @Output() permissionsChanged: EventEmitter<any> = new EventEmitter();
  public creating: boolean;
  public accessControl: any[] = [];
  private oriData: any;
  private defaultPermissions: any;
  public roles: any[] = [];
  private defaultPermissionsLoaded = false;

  // defaultPermissions = [{module: 'Users'}, {module: 'Clients'}];

  constructor(
    private crud: CrudService,
    private errorMessageService: ErrorMessagesService,
  ) { }

  usersPermissions = new FormGroup({
    userType: new FormControl(null, Validators.required),
    active: new FormControl(null, Validators.required),
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.creating = false;

    if ( !this.defaultPermissionsLoaded ) {
      this.defaultPermissionsLoaded = true;
      this.crud.getSettings('defaultPermissions', 'all').subscribe(res => {
        this.defaultPermissions = res;
        this.roles = res.roles;
        const defaultRole = this.roles.filter(role => role.type === 'authenticated');
        if (!this.recordData) {
          this.createAccessControlForm(res.defaultPermissions.permissions, defaultRole['0'].id, 'active');
        }
      });
    }

    if ( this.recordData ) {
      const {userPermissions, role, blocked} = this.recordData;
      const userStatus = blocked ? 'inactive' : 'active';
      this.createAccessControlForm( userPermissions.permissions, role.id, userStatus);
      this.oriData = this.usersPermissions.value;
      this.usersPermissions.disable();
    } else {
      this.creating = true;
    }
  }

  ngOnInit(): void {
    // this.usersPermissions.valueChanges.subscribe(res => {
    //   if (this.oriData) {
    //     if (JSON.stringify(this.oriData) !== JSON.stringify(this.usersPermissions.value)) {
    //       this.permissionsChanged.emit({formChanged: true});
    //     } else {
    //       this.permissionsChanged.emit({formChanged: false});
    //     }
    //   }
    // });
  }

  createAccessControlForm(permissions, role: string, userStatus: string) {
    this.accessControl = [];
    this.usersPermissions.patchValue({userType: role, active: userStatus});

    // this.usersPermissions.addControl('userType', new FormControl(role, Validators.required));
    // this.usersPermissions.addControl('active', new FormControl(userStatus, Validators.required));
    permissions.map(perm => {
      this.accessControl.push({
        module: perm.module,
        view: `${perm.module}View`,
        create: `${perm.module}Create`,
        edit: `${perm.module}Edit`,
        delete: `${perm.module}Delete`,
      });
      this.usersPermissions.addControl(`${perm.module}Create`, new FormControl(perm.create, Validators.required));
      this.usersPermissions.addControl(`${perm.module}View`, new FormControl(perm.view, Validators.required));
      this.usersPermissions.addControl(`${perm.module}Edit`, new FormControl(perm.edit, Validators.required));
      this.usersPermissions.addControl(`${perm.module}Delete`, new FormControl(perm.delete, Validators.required));
    });
  }

  editForm() {
    this.usersPermissions.enable();
  }

  createUser() {
    console.log(this.usersPermissions.value);
  }

  checkIfValid() {
    // Check if form is valid and return data or error
    this.usersPermissions.markAllAsTouched();
    if (!this.usersPermissions.invalid) {
      const request = this.formatRequest(this.usersPermissions.value);
      this.permissionsChanged.emit({ error: false, data: request, permissionsValid: true });
      this.usersPermissions.disable();
    } else {
      this.permissionsChanged.emit({ error: true, data: null });
    }
  }

  // updateUser() {
  //   console.log(this.usersPermissions.value);
  //   const request = this.formatRequest(this.usersPermissions.value);
  //   const id = this.recordData.id ? this.recordData.id : null;
  //   this.crud.updateRecord('update-user', id, request).subscribe(res => {
  //     this.permissionsChanged.emit({permissionsUpdated: true});
  //     this.usersPermissions.disable();
  //     console.log(res);
  //   }, err => {
  //     this.permissionsChanged.emit({error: true});
  //     this.errorMessageService.showError('Error Updating this user permissions');
  //     console.log(err);
  //   });
  // }

  formatRequest(data) {
    let permissions;

    if (!this.creating) {
      permissions = this.recordData.userPermissions.permissions.map( perm => {
        perm.create = data[`${perm.module}Create`];
        perm.view = data[`${perm.module}View`];
        perm.edit = data[`${perm.module}Edit`];
        perm.delete = data[`${perm.module}Delete`];
        return perm;
      });
    } else {
      permissions = this.defaultPermissions.defaultPermissions.permissions.map( perm => {
        const defPerm = {
          create: data[`${perm.module}Create`],
          view: data[`${perm.module}View`],
          edit: data[`${perm.module}Edit`],
          delete: data[`${perm.module}Delete`],
          module: perm.module,
        };
        return defPerm;
      });
    }

    const users = {
      blocked: data.active === 'inactive',
      role: data.userType,
      userPermissions: {permissions}
    };
    return users;
  }
}
