import { Routes } from '@angular/router';

export const flashcard_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./deck-browser/deck-browser').then((m) => m.DeckBrowser),
  },
  {
    path: 'deck',
    loadComponent: () => import('./deck-editor/deck-editor').then((m) => m.DeckEditor),
  },
  {
    path: 'deck/:deckId',
    loadComponent: () => import('./deck-editor/deck-editor').then((m) => m.DeckEditor),
  },
  {
    path: 'deck/:deckId/browse',
    loadComponent: () => import('./card-browser/card-browser').then((m) => m.CardBrowser),
  },
  {
    path: 'deck/:deckId/card',
    loadComponent: () => import('./card-editor/card-editor').then((m) => m.CardEditor),
  },
  {
    path: 'deck/:deckId/card/:cardId',
    loadComponent: () => import('./card-editor/card-editor').then((m) => m.CardEditor),
  },
  {
    path: 'deck/:deckId/study',
    loadComponent: () => import('./study-session/study-session').then((m) => m.StudySession),
  },
  {
    path: 'deck/:deckId/study/:box',
    loadComponent: () => import('./study-session/study-session').then((m) => m.StudySession),
  },
];
