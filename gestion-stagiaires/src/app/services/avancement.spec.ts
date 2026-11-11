import { TestBed } from '@angular/core/testing';
import { Avancement } from './avancement';

describe('Avancement', () => {
  let service: Avancement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Avancement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
