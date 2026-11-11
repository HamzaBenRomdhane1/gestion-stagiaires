import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncadrantPage } from './encadrant-page';

describe('EncadrantPage', () => {
  let component: EncadrantPage;
  let fixture: ComponentFixture<EncadrantPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadrantPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EncadrantPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
