import { SettingsService } from '../../../../services/settings.service';
import { FormItem } from '../../../../_interfaces/form-item';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../../../../services/crud.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  @Input() record: any;
  public input: FormItem;
  public inputList: FormItem[] = [];
  public editing = false;
  public assignedTo;
  public profileForm: FormGroup;

  constructor(
    private crud: CrudService,
    private fb: FormBuilder,
    private settingService: SettingsService,
  ) {
    this.profileForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.settingService.getFieldSettings().subscribe(res => {
      res.forEach(control => {
        if (control.visible) {
          const formControl = control.required ? new FormControl(null, Validators.required) : new FormControl(null);
          this.profileForm.addControl(control.name, formControl);
          this.inputList.push(control);
        }
      });
      this.getData();
      this.profileForm.disable();
    });
  }

  getData() {
    this.record.createdAt = new Date(this.record.createdAt).toLocaleString();
    this.record.updatedAt = new Date(this.record.updatedAt).toLocaleString();
    this.profileForm.patchValue(this.record);
  }

  updateData() {
    if (!this.profileForm.invalid) {
      this.crud.updateData('clients', this.record.id, this.profileForm.value).subscribe(res => {
        this.editing = false;
      });
    }
  }

  enableForm() {
    this.editing = true;
    this.profileForm.enable();
  }

  cancelForm() {
    this.editing = false;
    this.profileForm.disable();
    this.profileForm.reset();
    this.getData();
  }
}
