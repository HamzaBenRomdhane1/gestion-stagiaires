import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RhAccueil } from './rh-accueil';

describe('RhAccueil', () => {
  let component: RhAccueil;
  let fixture: ComponentFixture<RhAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RhAccueil],
    }).compileComponents();

    fixture = TestBed.createComponent(RhAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
