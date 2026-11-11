import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidaturePage } from './candidature-page';

describe('CandidaturePage', () => {
  let component: CandidaturePage;
  let fixture: ComponentFixture<CandidaturePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidaturePage],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidaturePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
