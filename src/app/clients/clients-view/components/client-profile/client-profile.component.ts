import { SettingsService } from '../../../../services/settings.service';
import { FormItem } from '../../../../_interfaces/form-item';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../../../../services/crud.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit, OnChanges {
  @Input() recordData: any;
  // public record: any;
  public input: FormItem;
  public inputList: FormItem[] = [];
  public editing = false;
  public creating: boolean;
  public assignedTo;
  public profileForm: FormGroup;
  public selectDisabled: boolean;
  public form: any;

  constructor(
    private crud: CrudService,
    private fb: FormBuilder,
    private settingService: SettingsService,
  ) {
    this.profileForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.recordData){
      this.creating = false;
    }

    if (this.form) {
      this.form.then(() => {
        this.setData();
      });
    }
  }

  ngOnInit(): void {
    this.creating = true;
    this.buildForm();
  }

  async buildForm() {
    this.form = this.settingService.getFieldSettings().toPromise()
    .then(res => {
      res.forEach(control => {
        if (control.visible) {
          const formControl = control.required ? new FormControl(null, Validators.required) : new FormControl(null);
          this.profileForm.addControl(control.name, formControl);
          this.inputList.push(control);
        }
      });
      return res;
    }).catch(err => console.log(err));
    await this.form;
  }

  setData() {
    this.recordData.createdAt = new Date(this.recordData.createdAt).toLocaleString();
    this.recordData.updatedAt = new Date(this.recordData.updatedAt).toLocaleString();
    this.profileForm.patchValue(this.recordData);
    this.selectDisabled = true;
    this.profileForm.disable();
  }

  submitData() {
    if (!this.profileForm.invalid) {
      if (!this.creating) {
        this.crud.updateData('clients', this.recordData.id, this.profileForm.value).subscribe(res => {
          console.log(res);
          this.editing = false;
        });
      } else {
        this.crud.createData('clients', this.profileForm.value).subscribe(res => {
          console.log(res);
        });
      }
    }
  }

  setDefaultValue(name: string, e) {
    // this.profileForm.patchValue({status: e});
  }

  enableForm() {
    this.editing = true;
    this.selectDisabled = false;
    this.profileForm.enable();
  }

  cancelForm() {
    this.editing = false;
    this.profileForm.reset();
    this.setData();
  }
}
