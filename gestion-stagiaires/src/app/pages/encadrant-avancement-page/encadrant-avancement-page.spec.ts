import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncadrantAvancementPage } from './encadrant-avancement-page';

describe('EncadrantAvancementPage', () => {
  let component: EncadrantAvancementPage;
  let fixture: ComponentFixture<EncadrantAvancementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadrantAvancementPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EncadrantAvancementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
