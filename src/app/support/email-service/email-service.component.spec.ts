import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailServiceComponent } from './email-service.component';

describe('EmailServiceComponent', () => {
  let component: EmailServiceComponent;
  let fixture: ComponentFixture<EmailServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
