import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPermissionsUserComponent } from './settings-permissions-user.component';

describe('SettinsPermissionsUserComponent', () => {
  let component: SettingsPermissionsUserComponent;
  let fixture: ComponentFixture<SettingsPermissionsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPermissionsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPermissionsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
