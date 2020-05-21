import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteCreateComponent } from './autocomplete-create.component';

describe('AutocompleteCreateComponent', () => {
  let component: AutocompleteCreateComponent;
  let fixture: ComponentFixture<AutocompleteCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
