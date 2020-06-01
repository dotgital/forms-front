import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
  @Input() creating: boolean;
  @Output() dataUpdated: EventEmitter<any> = new EventEmitter();
  @Output() clientChanged: EventEmitter<any> = new EventEmitter();

  public input: FormItem;
  public inputList: FormItem[] = [];
  public editing: boolean;
  public defaultValue: object = {};
  public dataChanged: boolean;

  public profileForm: FormGroup;
  // private oriData: any;
  private emptyForm: Observable<any>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private crud: CrudService,
    private fb: FormBuilder,
  ) {
    this.profileForm = this.fb.group({});
    this.buildEmptyForm();
  }

  /*
  * OnChanges livecycle loop from all the prop @input and check which one changed
  * if creating is true build a empty form
  * if recordData exist and recordData dont have previuos value build and empty form and patch the recordData values
  * if recordData exist and recordData have previous values only path the form with new values
  */
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'creating': {
            if (changes[propName].currentValue === true) {
              this.emptyForm.subscribe();
            }
            break;
          }
          case 'recordData': {
            if (changes[propName].currentValue && !changes[propName].previousValue) {
              this.emptyForm.subscribe(res => {
                this.setData();
              });
            } else if (changes[propName].currentValue && changes[propName].previousValue) {
              this.setData();
            }
            break;
          }
        }
      }
    }
  }

  ngOnInit(): void {}

  /*
  * Get forms fields from the API loops through all fields and create a formControl for each field
  * @return observable to subcribe and display the forms in the template
  */
  buildEmptyForm() {
    const query = `contentType=clients`;
    this.emptyForm = this.crud.getRecordList('settings-fields', query).pipe(switchMap(async (res) => {
      res.sort((a, b) => {
        return a.position - b.position;
      });
      for await (const control of res) {
        if (control.visible) {
          const formControl = control.required ? new FormControl(null, Validators.required) : new FormControl(null);
          this.profileForm.addControl(control.fieldName, formControl);
          this.inputList.push(control);
          this.defaultValue[control.fieldName] = control.default;
        }
      }
      return res;
    }));
  }

  setData() {
    this.profileForm.patchValue(this.recordData);
    // this.oriData = this.profileForm.value;
    this.editing = false;
    this.profileForm.disable();
  }

  /*
  * Mark all forms controls as touched and emit any errors (if exist) to parent component
  */
  checkIfValid() {
    this.profileForm.markAllAsTouched();
    if (!this.profileForm.invalid) {
      this.clientChanged.emit({error: false, data: this.profileForm.value, profileValid: true});
      this.profileForm.disable();
    } else {
      this.clientChanged.emit({error: true, data: null});
    }
  }

  editForm() {
    this.profileForm.enable();
  }
}
