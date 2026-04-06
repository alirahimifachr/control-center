import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckBrowser } from './deck-browser';

describe('DeckBrowser', () => {
  let component: DeckBrowser;
  let fixture: ComponentFixture<DeckBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckBrowser],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckBrowser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
