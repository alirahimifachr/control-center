export const BOXES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Box = (typeof BOXES)[number];

export const BOX_LABELS: Record<Box, string> = {
  0: 'New',
  1: 'Box 1',
  2: 'Box 2',
  3: 'Box 3',
  4: 'Box 4',
  5: 'Box 5',
  6: 'Box 6',
  7: 'Box 7',
  8: 'Done',
};

export const BOX_SHORT_LABELS: Record<Box, string> = {
  0: 'New',
  1: 'B1',
  2: 'B2',
  3: 'B3',
  4: 'B4',
  5: 'B5',
  6: 'B6',
  7: 'B7',
  8: 'Done',
};

export const MIN_BOX: Box = 0;
export const MAX_BOX: Box = 8;
