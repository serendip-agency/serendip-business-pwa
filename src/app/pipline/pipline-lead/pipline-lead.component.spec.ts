import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiplineLeadComponent } from './pipline-lead.component';

describe('PiplineLeadComponent', () => {
  let component: PiplineLeadComponent;
  let fixture: ComponentFixture<PiplineLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiplineLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiplineLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
