import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBrowser } from './card-browser';

describe('CardBrowser', () => {
  let component: CardBrowser;
  let fixture: ComponentFixture<CardBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBrowser],
    }).compileComponents();

    fixture = TestBed.createComponent(CardBrowser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
