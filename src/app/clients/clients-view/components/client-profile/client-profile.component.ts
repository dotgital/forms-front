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
  @Input() create: boolean;
  public input: FormItem;
  public inputList: FormItem[] = [];
  public editing: boolean;
  public creating: boolean;
  public defaultValue: object = {};
  public dataChanged: boolean;

  public profileForm: FormGroup;
  public emptyForm: any;
  private oriData: any;

  constructor(
    private crud: CrudService,
    private fb: FormBuilder,
    private settingService: SettingsService,
  ) {
    this.profileForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.creating = this.recordData ? false : true;
    console.log('this record data', this.recordData);
    console.log('this creating', this.create);

    if (this.recordData || this.create === true) {
      this.buildForm();
    }
    // check if the empty form is ready to patch the data
    // if (this.emptyForm) {
    //   this.emptyForm.then(() => {
    //     this.setData();
    //   });
    // }
  }

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe(res => {
      if (this.oriData) {
        if (JSON.stringify(this.oriData) !== JSON.stringify(this.profileForm.value)) {
          this.dataChanged = true;
        } else {
          this.dataChanged = false;
        }
      }
    });
  }

  async buildForm() {
    console.log('building forms');
    this.emptyForm = this.settingService.getSettings('layout', 'clients').subscribe(async res => {
      for await (const control of res) {
        if (control.visible) {
          const formControl = control.required ? new FormControl(null, Validators.required) : new FormControl(null);
          this.profileForm.addControl(control.fieldName, formControl);
          this.inputList.push(control);
          this.defaultValue[control.fieldName] = control.default;
        }
      }
      if (!this.create) {
        this.setData();
      } else {
        this.profileForm.patchValue(this.defaultValue);
      }

    });
  }

  // async buildForm() {
  //   this.emptyForm = this.settingService.getSettings('layout', 'clients').toPromise()
  //   .then(res => {
  //     res.forEach(control => {
  //       if (control.visible) {
  //         const formControl = control.required ? new FormControl(null, Validators.required) : new FormControl(null);
  //         this.profileForm.addControl(control.name, formControl);
  //         this.inputList.push(control);
  //         this.defaultValue[control.name] = control.default;
  //       }
  //     });
  //     return res;
  //   }).catch(err => console.log(err));
  //   await this.emptyForm;
  //   if (this.creating) {
  //     this.profileForm.patchValue(this.defaultValue);
  //   }
  // }

  setData() {
    this.recordData.createdAt = new Date(this.recordData.createdAt).toLocaleString();
    this.recordData.updatedAt = new Date(this.recordData.updatedAt).toLocaleString();
    // console.log(this.recordData)
    this.profileForm.patchValue(this.recordData);
    this.oriData = this.profileForm.value;
    this.editing = false;
    this.profileForm.disable();
  }

  submitData() {
    this.dataChanged = false;
    if (!this.profileForm.invalid) {
      if (!this.creating) {
        this.crud.updateData('clients', this.recordData.id, this.profileForm.value).subscribe(res => {
          console.log(res);
          this.recordData = res;
          this.setData();
        });
      } else {
        this.creating = false;
        this.crud.createData('clients', this.profileForm.value).subscribe(res => {
          this.recordData = res;
          this.setData();
        });
      }
    }
  }

  setDefaultValue(name: string, e) {
    // this.profileForm.patchValue({status: e});
  }

  enableForm() {
    this.editing = true;
    this.profileForm.enable();
  }

  cancelForm() {
    this.editing = false;
    this.profileForm.reset();
    this.setData();
  }
}
