import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPermissionsComponent } from './settings-permissions.component';

describe('SettingsPermissionsComponent', () => {
  let component: SettingsPermissionsComponent;
  let fixture: ComponentFixture<SettingsPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
