import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsServiceComponent } from './sms-service.component';

describe('SmsServiceComponent', () => {
  let component: SmsServiceComponent;
  let fixture: ComponentFixture<SmsServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
