import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesStagiaires } from './mes-stagiaires';

describe('MesStagiaires', () => {
  let component: MesStagiaires;
  let fixture: ComponentFixture<MesStagiaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesStagiaires],
    }).compileComponents();

    fixture = TestBed.createComponent(MesStagiaires);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
