import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiplineDealComponent } from './pipline-deal.component';

describe('PiplineDealComponent', () => {
  let component: PiplineDealComponent;
  let fixture: ComponentFixture<PiplineDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiplineDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiplineDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
