import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTypeSelectComponent } from './company-type-select.component';

describe('CompanyTypeSelectComponent', () => {
  let component: CompanyTypeSelectComponent;
  let fixture: ComponentFixture<CompanyTypeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTypeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
