import { TestBed } from '@angular/core/testing';
import { Notif } from './notif';

describe('Notif', () => {
  let service: Notif;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notif);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
