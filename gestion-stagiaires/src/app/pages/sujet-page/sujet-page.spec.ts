import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SujetPage } from './sujet-page';

describe('SujetPage', () => {
  let component: SujetPage;
  let fixture: ComponentFixture<SujetPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SujetPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SujetPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
