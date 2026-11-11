import { TestBed } from '@angular/core/testing';
import { Encadrant } from './encadrant';

describe('Encadrant', () => {
  let service: Encadrant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Encadrant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
