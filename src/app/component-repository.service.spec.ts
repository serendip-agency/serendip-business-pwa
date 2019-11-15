import { TestBed } from '@angular/core/testing';

import { ComponentRepositoryService } from './component-repository.service';

describe('ComponentRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentRepositoryService = TestBed.get(ComponentRepositoryService);
    expect(service).toBeTruthy();
  });
});
