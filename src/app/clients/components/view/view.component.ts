import { SettingsService } from '../../../services/settings.service';
import { FormItem } from '../../../_interfaces/form-item';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../../../services/crud.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @Input() record: any;

  // public viewForm: FormGroup;
  public formItems: FormItem[] = [];
  public editing = false;
  public assignedTo;
  private formAttributes: {};
  private formMetadata: {};

  public viewForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    phoneMobile: new FormControl(null, Validators.required),
    phoneOther: new FormControl(null),
  });

  constructor(
    private crud: CrudService,
    private fb: FormBuilder,
    private setting: SettingsService,
  ) {
    // this.viewForm = this.fb.group({});
  }

  ngOnInit(): void {
    // this.getMetadata();
    this.getData()
    this.viewForm.disable();
  }

  enableForm() {
    this.editing = true;
    this.viewForm.enable();
  }

  cancelForm() {
    this.editing = false;
    this.viewForm.disable();
    this.viewForm.reset();
    this.getData();
  }

  getMetadata() {
    const uid = 'application::clients.clients';

    this.crud.getMetadata(uid).subscribe(res => {
      this.formAttributes = res.data.contentType.schema.attributes;
      this.formMetadata = res.data.contentType.metadatas;

      console.log(res);
      Object.keys(this.formAttributes).forEach(key => {
        if (key !== 'id') {
          this.viewForm.addControl(
            key,
            new FormControl(null, null)
          );
          this.createsField(key);
        }
      });
      console.log(this.formItems);
      this.getData();
    });
  }

  createsField(key: string) {
    const attribute = this.formAttributes[key];
    const formItem = {
      name: key,
      type: attribute.type,
      label: this.formMetadata[key].edit.label,
      related: attribute.type === 'relation' ? attribute.model : null,
      options: null
    };
    this.formItems.push(formItem);
  }

  getData() {
    // const fields = this.formItems.map(item => {
    //   return item.type !== 'relation' ? item.name : `${item.name}{id}`;
    // });

    // this.crud.getData(null, this.record.id).subscribe(res => {
    //   console.log(res);
    console.log(this.record);
    this.record.createdAt = new Date(this.record.createdAt).toLocaleString();
    this.record.updatedAt = new Date(this.record.updatedAt).toLocaleString();
    this.viewForm.patchValue(this.record);
    // });

    // const query = `query {
    //   client(id: "${this.record.id}"){
    //     id
    //     ${fields}
    //   }
    //   users{
    //     id
    //     username
    //   }
    // }`;

    // this.crud.getRecordData(query).subscribe(res => {
    //   console.log(res)
    //   this.assignedTo = res.data.users;
    //   this.viewForm.patchValue(res.data.client);
    // });
  }
}
