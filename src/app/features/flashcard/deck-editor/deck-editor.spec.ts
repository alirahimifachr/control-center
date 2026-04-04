import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditor } from './deck-editor';

describe('DeckEditor', () => {
  let component: DeckEditor;
  let fixture: ComponentFixture<DeckEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
