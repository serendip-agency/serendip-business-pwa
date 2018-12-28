import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageFilesComponent } from './storage-files.component';

describe('StorageFilesComponent', () => {
  let component: StorageFilesComponent;
  let fixture: ComponentFixture<StorageFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
