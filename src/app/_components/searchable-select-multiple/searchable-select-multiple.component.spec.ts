import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableSelectMultipleComponent } from './searchable-select-multiple.component';

describe('SearchableSelectMultipleComponent', () => {
  let component: SearchableSelectMultipleComponent;
  let fixture: ComponentFixture<SearchableSelectMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchableSelectMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableSelectMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
