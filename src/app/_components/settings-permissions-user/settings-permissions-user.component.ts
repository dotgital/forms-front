import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-permissions-user',
  templateUrl: './settings-permissions-user.component.html',
  styleUrls: ['./settings-permissions-user.component.scss']
})
export class SettingsPermissionsUserComponent implements OnInit, OnChanges {
  @Input() userPermissions: any;
  @Input() module: string;
  @Input() editing: boolean;
  @Output() permissionsChanged: EventEmitter<any> = new EventEmitter();
  recordName: string;
  userId: string;
  oriData: any;

  permissionsForm = new FormGroup({
    create: new FormControl(null, Validators.required),
    view: new FormControl(null, Validators.required),
    edit: new FormControl(null, Validators.required),
    delete: new FormControl(null, Validators.required)
  });
  ngOnChanges(changes: SimpleChanges): void {
    if (this.userPermissions) {
      this.recordName = this.userPermissions.recordName;
      this.userId = this.userPermissions.id;
      this.userPermissions.userPermissions.map(res => {
        if ( res.module === this.module ) {
          this.permissionsForm.patchValue(res);
          this.oriData = this.permissionsForm.value;
          this.permissionsForm.disable();
        }
      });
    }
    if (this.editing === true) {
      this.permissionsForm.enable();
    } else if (this.editing === false){
      this.permissionsForm.disable();
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.permissionsForm.valueChanges.subscribe(res => {
      if (this.oriData) {
        if (JSON.stringify(this.oriData) !== JSON.stringify(this.permissionsForm.value)) {
          this.permissionsChanged.emit({formChanged: true, id: this.userId, permissions: this.permissionsForm.value});
        } else {
          this.permissionsChanged.emit({formChanged: false});
        }
      }
    });
  }

}
