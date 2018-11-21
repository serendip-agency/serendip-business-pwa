import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaxComponent } from './fax.component';

describe('FaxComponent', () => {
  let component: FaxComponent;
  let fixture: ComponentFixture<FaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
