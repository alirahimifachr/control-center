import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardMain } from './flashcard-main';

describe('FlashcardMain', () => {
  let component: FlashcardMain;
  let fixture: ComponentFixture<FlashcardMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardMain],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
