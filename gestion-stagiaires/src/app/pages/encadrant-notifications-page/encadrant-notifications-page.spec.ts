import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncadrantNotificationsPage } from './encadrant-notifications-page';

describe('EncadrantNotificationsPage', () => {
  let component: EncadrantNotificationsPage;
  let fixture: ComponentFixture<EncadrantNotificationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadrantNotificationsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EncadrantNotificationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
