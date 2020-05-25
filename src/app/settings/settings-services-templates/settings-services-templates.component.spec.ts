import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsServicesTemplatesComponent } from './settings-services-templates.component';

describe('SettingsServicesTemplatesComponent', () => {
  let component: SettingsServicesTemplatesComponent;
  let fixture: ComponentFixture<SettingsServicesTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsServicesTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsServicesTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
