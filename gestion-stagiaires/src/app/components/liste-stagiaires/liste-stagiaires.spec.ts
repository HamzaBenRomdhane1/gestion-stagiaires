import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeStagiaires } from './liste-stagiaires';

describe('ListeStagiaires', () => {
  let component: ListeStagiaires;
  let fixture: ComponentFixture<ListeStagiaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeStagiaires],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeStagiaires);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
