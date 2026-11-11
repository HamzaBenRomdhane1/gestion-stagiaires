import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvancementPage } from './avancement-page';

describe('AvancementPage', () => {
  let component: AvancementPage;
  let fixture: ComponentFixture<AvancementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvancementPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AvancementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
