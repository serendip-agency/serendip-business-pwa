import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiplineSaleComponent } from './pipline-sale.component';

describe('PiplineSaleComponent', () => {
  let component: PiplineSaleComponent;
  let fixture: ComponentFixture<PiplineSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiplineSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiplineSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
