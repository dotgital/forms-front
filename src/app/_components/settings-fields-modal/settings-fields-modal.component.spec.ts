import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFieldsModalComponent } from './settings-fields-modal.component';

describe('SettingsFieldsModalComponent', () => {
  let component: SettingsFieldsModalComponent;
  let fixture: ComponentFixture<SettingsFieldsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsFieldsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
