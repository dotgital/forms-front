import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesTypeSelectorComponent } from './services-type-selector.component';

describe('ServicesTypeSelectorComponent', () => {
  let component: ServicesTypeSelectorComponent;
  let fixture: ComponentFixture<ServicesTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesTypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
