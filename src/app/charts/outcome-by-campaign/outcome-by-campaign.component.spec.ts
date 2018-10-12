import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomeByCampaignComponent } from './outcome-by-campaign.component';

describe('OutcomeByCampaignComponent', () => {
  let component: OutcomeByCampaignComponent;
  let fixture: ComponentFixture<OutcomeByCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcomeByCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutcomeByCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
