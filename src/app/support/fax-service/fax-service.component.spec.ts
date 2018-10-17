import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaxServiceComponent } from './fax-service.component';

describe('FaxServiceComponent', () => {
  let component: FaxServiceComponent;
  let fixture: ComponentFixture<FaxServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaxServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaxServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
