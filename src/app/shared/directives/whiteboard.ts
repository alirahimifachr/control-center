import { Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
  selector: '[appWhiteboard]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp()',
    '(pointerleave)': 'onPointerUp()',
  },
})
export class Whiteboard implements OnInit {
  private canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private lastPoint: { x: number; y: number } | null = null;

  ngOnInit() {
    this.ctx = this.canvas.getContext('2d')!;
    this.syncSize();
    new ResizeObserver(() => this.syncSize()).observe(this.canvas);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private syncSize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  private getPoint(e: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  onPointerDown(e: PointerEvent) {
    this.drawing = true;
    this.lastPoint = this.getPoint(e);
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.canvas.setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent) {
    if (!this.drawing) return;
    const point = this.getPoint(e);
    const pressure = e.pressure > 0 ? e.pressure : 0.5;
    this.ctx.lineWidth = 3 * pressure * 2;

    const mid = {
      x: (this.lastPoint!.x + point.x) / 2,
      y: (this.lastPoint!.y + point.y) / 2,
    };
    this.ctx.quadraticCurveTo(this.lastPoint!.x, this.lastPoint!.y, mid.x, mid.y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(mid.x, mid.y);
    this.lastPoint = point;
  }

  onPointerUp() {
    this.drawing = false;
    this.lastPoint = null;
  }
}
