import { Pipe, PipeTransform } from '@angular/core';
import { BOX_LABELS, type Box } from '../models/box';

@Pipe({
  name: 'boxLabel',
})
export class BoxLabelPipe implements PipeTransform {
  transform(value: number | undefined): string {
    return value === undefined ? 'All' : BOX_LABELS[value as Box];
  }
}
