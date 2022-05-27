import { Point } from './Field';
import { FIGURE_COLORS } from '../defaults';

export class Cell {
    X: number;
    Y: number;
    private content: number

    constructor (x: number, y: number, content?: number) {
        this.X       = x;
        this.Y       = y;
        this.content = content || 0;
    }

    get Position (): Point {
        return { X: this.X, Y: this.Y };
    }

    get Color (): string {
        if (!this.content)
            return 'black';

        return Object.values(FIGURE_COLORS)[this.content - 1] || 'darkblue';
    }

    get Empty (): boolean {
        return this.Content === 0;
    }

    get Content (): number {
        return this.content;
    }

    set Content (val) {
        this.content = val;
    }
}
