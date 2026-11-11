import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StagiairePage } from './stagiaire-page';

describe('StagiairePage', () => {
  let component: StagiairePage;
  let fixture: ComponentFixture<StagiairePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiairePage],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiairePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
