import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityWebhookViewComponent } from './entity-webhook-view.component';

describe('EntityWebhookViewComponent', () => {
  let component: EntityWebhookViewComponent;
  let fixture: ComponentFixture<EntityWebhookViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityWebhookViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityWebhookViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
