import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncadrantAccueil } from './encadrant-accueil';

describe('EncadrantAccueil', () => {
  let component: EncadrantAccueil;
  let fixture: ComponentFixture<EncadrantAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadrantAccueil],
    }).compileComponents();

    fixture = TestBed.createComponent(EncadrantAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
