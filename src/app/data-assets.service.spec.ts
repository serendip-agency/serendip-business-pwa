import { TestBed, inject } from '@angular/core/testing';

import { DataAssetsService } from './data-assets.service';

describe('DataAssetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAssetsService]
    });
  });

  it('should be created', inject([DataAssetsService], (service: DataAssetsService) => {
    expect(service).toBeTruthy();
  }));
});
