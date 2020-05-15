import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesTypeConfigComponent } from './services-type-config.component';

describe('ServicesTypeConfigComponent', () => {
  let component: ServicesTypeConfigComponent;
  let fixture: ComponentFixture<ServicesTypeConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesTypeConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesTypeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
