import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StagiaireAccueil } from './stagiaire-accueil';

describe('StagiaireAccueil', () => {
  let component: StagiaireAccueil;
  let fixture: ComponentFixture<StagiaireAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireAccueil],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
