import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageriePage } from './messagerie-page';

describe('MessageriePage', () => {
  let component: MessageriePage;
  let fixture: ComponentFixture<MessageriePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageriePage],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageriePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
