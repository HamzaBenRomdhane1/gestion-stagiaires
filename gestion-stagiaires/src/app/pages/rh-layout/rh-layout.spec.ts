import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RhLayout } from './rh-layout';

describe('RhLayout', () => {
  let component: RhLayout;
  let fixture: ComponentFixture<RhLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RhLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(RhLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
