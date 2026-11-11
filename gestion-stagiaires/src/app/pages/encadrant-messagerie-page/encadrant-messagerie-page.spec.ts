import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncadrantMessageriePage } from './encadrant-messagerie-page';

describe('EncadrantMessageriePage', () => {
  let component: EncadrantMessageriePage;
  let fixture: ComponentFixture<EncadrantMessageriePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadrantMessageriePage],
    }).compileComponents();

    fixture = TestBed.createComponent(EncadrantMessageriePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
