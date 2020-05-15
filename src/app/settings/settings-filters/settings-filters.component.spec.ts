import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFiltersComponent } from './settings-filters.component';

describe('SettingsFiltersComponent', () => {
  let component: SettingsFiltersComponent;
  let fixture: ComponentFixture<SettingsFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
