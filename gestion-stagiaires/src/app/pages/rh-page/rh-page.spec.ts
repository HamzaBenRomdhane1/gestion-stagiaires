import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RhPage } from './rh-page';

describe('RhPage', () => {
  let component: RhPage;
  let fixture: ComponentFixture<RhPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RhPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RhPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
