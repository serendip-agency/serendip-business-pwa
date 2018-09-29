import { TestBed, inject } from '@angular/core/testing';

import { GmapsService } from './gmaps.service';

describe('GmapsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GmapsService]
    });
  });

  it('should be created', inject([GmapsService], (service: GmapsService) => {
    expect(service).toBeTruthy();
  }));
});
