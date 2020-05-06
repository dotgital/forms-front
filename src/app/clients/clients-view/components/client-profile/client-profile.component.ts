import { FormItem } from '../../../../_interfaces/form-item';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../../../../services/crud.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit, OnChanges {
  @Input() recordData: any;
  @Input() create: boolean;
  @Output() formChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() dataCreated: EventEmitter<any> = new EventEmitter();
  @Output() dataUpdated: EventEmitter<any> = new EventEmitter();
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
  ) {
    this.profileForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.creating = this.recordData ? false : true;
    if (this.recordData || this.create === true) {
      this.inputList = [];
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe(res => {
      if (this.oriData) {
        if (JSON.stringify(this.oriData) !== JSON.stringify(this.profileForm.value)) {
          this.formChanged.emit(true);
        } else {
          this.formChanged.emit(false);
        }
      }
    });
  }

  async buildForm() {
    this.emptyForm = this.crud.getSettings('layout', 'clients').subscribe(async res => {
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

  setData() {
    this.recordData.createdAt = new Date(this.recordData.createdAt).toLocaleString();
    this.recordData.updatedAt = new Date(this.recordData.updatedAt).toLocaleString();
    // console.log(this.recordData)
    this.profileForm.patchValue(this.recordData);
    this.oriData = this.profileForm.value;
    this.editing = false;
    this.profileForm.disable();
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

  updateClient() {
    // Touch all controls to show any error
    this.profileForm.markAllAsTouched();

    if (!this.profileForm.invalid) {
      // Emit to parent to start Loading overlay and disable save button
      this.dataUpdated.emit({ loading: true });
      this.formChanged.emit(false);

      this.crud.updateRecord('clients', this.recordData.id, this.profileForm.value).subscribe(res => {
        this.dataUpdated.emit({ record: res, loading: false });
        this.formChanged.emit(false);
        this.recordData = res;
        this.setData();
      }, err => {
        console.log(err);
        this.dataUpdated.emit({ err, loading: false });
      });
    }
  }

  createClient() {
    // Touch all controls to show any error
    this.profileForm.markAllAsTouched();

    if (!this.profileForm.invalid) {
      // Emit to parent to start loading overlay
      this.dataCreated.emit({ loading: true });
      this.creating = false;
      this.crud.createRecord('clients', this.profileForm.value).subscribe(res => {
        this.dataCreated.emit( {dataCreated: true, recordId: res['id'], loading: false} );
        this.recordData = res;
        this.setData();
      }, err => {
        console.log(err);
        this.dataCreated.emit( {dataCreated: false, loading: false} );
      });
    }
  }

  // submitData() {
  //   this.dataChanged = false;
  //   if (!this.profileForm.invalid) {
  //     if (!this.creating) {
  //       this.crud.updateData('clients', this.recordData.id, this.profileForm.value).subscribe(res => {
  //         console.log(res);
  //         this.recordData = res;
  //         this.setData();
  //       });
  //     } else {
  //       this.creating = false;
  //       this.crud.createData('clients', this.profileForm.value).subscribe(res => {
  //         this.recordData = res;
  //         this.setData();
  //       });
  //     }
  //   }
  // }
}
