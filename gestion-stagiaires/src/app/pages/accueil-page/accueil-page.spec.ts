import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilPage } from './accueil-page';

describe('AccueilPage', () => {
  let component: AccueilPage;
  let fixture: ComponentFixture<AccueilPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AccueilPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
