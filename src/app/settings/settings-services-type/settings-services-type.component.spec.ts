import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsServicesTypeComponent } from './settings-services-type.component';

describe('SettingsServicesTypeComponent', () => {
  let component: SettingsServicesTypeComponent;
  let fixture: ComponentFixture<SettingsServicesTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsServicesTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsServicesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
