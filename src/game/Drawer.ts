import { Cell } from '../field/Cell';
import { Figure } from '../field/Figure';
import { Point, Size } from '../field/Field';

interface Canvas {
    element: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

const ScoreRect: { start: Point, size: Size }      = {
    start: {
        X: 0,
        Y: 0,
    },
    size: {
        Width:  340,
        Height: 140,
    },
};
const NextFigureRect: { start: Point, size: Size } = {
    start: {
        X: 0,
        Y: 140,
    },
    size: {
        Width:  340,
        Height: 200,
    },
};

export class Drawer {
    private gameCanvas: Canvas;
    private dashboardCanvas: Canvas;
    private gridSize = 32;

    constructor (gameCanvas: HTMLCanvasElement, dashboardCanvas: HTMLCanvasElement) {
        const gameCanvasContext      = gameCanvas?.getContext('2d');
        const dashboardCanvasContext = dashboardCanvas?.getContext('2d');

        if (!gameCanvas || !gameCanvasContext || !dashboardCanvas || !dashboardCanvasContext)
            throw new Error('Canvas or canvas context is not defined');

        this.gameCanvas      = { element: gameCanvas, context: gameCanvasContext };
        this.dashboardCanvas = { element: dashboardCanvas, context: dashboardCanvasContext };

        this.UpdateDashboardScore(0);
    }

    public UpdateField (cells: Cell[][], figure: Figure): void {
        const ctx = this.gameCanvas.context;

        ctx.clearRect(0, 0, this.gameCanvas.element.width, this.gameCanvas.element.height);
        this.drawField(ctx, cells);
        this.drawFigure(ctx, figure);
    }

    private drawField (ctx: CanvasRenderingContext2D, cells: Cell[][]): void {
        for (const row of cells) {
            for (const cell of row)
                this.drawCellRect(ctx, cell.Position, cell.Color, cell.Content > 0 ? 'white' : void 0);

        }
    }

    private drawFigure (ctx: CanvasRenderingContext2D, figure: Figure): void {
        const figureRelativeCells = figure.LinerCellsWithoutEmpty;

        for (const figureRelativeCell of figureRelativeCells)
            this.drawCellRect(ctx, figureRelativeCell.Position, figureRelativeCell.Color, 'white');
    }

    private drawCellRect (ctx: CanvasRenderingContext2D, position: Point, color: string, borderColor?: string): void {
        const borderWidth = borderColor ? 1 : 0;
        const offset      = borderWidth * 2;

        if (borderColor) {
            ctx.fillStyle = borderColor;
            ctx.fillRect(position.X * this.gridSize, position.Y * this.gridSize, this.gridSize, this.gridSize);
        }
        ctx.fillStyle = color;
        ctx.fillRect(position.X * this.gridSize + borderWidth, position.Y * this.gridSize + borderWidth, this.gridSize - offset, this.gridSize - offset);

    }

    UpdateDashboardScore (detail: number): void {
        const ctx = this.dashboardCanvas.context;

        ctx.clearRect(ScoreRect.start.X, ScoreRect.start.Y, ScoreRect.size.Width, ScoreRect.size.Height);
        ctx.font      = '48px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${detail.toString()}`, ScoreRect.start.X + 80, ScoreRect.start.Y + 40);
    }

    UpdateDashboardFigure (figure: Figure): void {
        console.log('update dashboard figure');
        const ctx = this.dashboardCanvas.context;

        ctx.clearRect(NextFigureRect.start.X, NextFigureRect.start.Y, NextFigureRect.size.Width, NextFigureRect.size.Height);
        figure = new Figure(figure.Matrix, figure.type,
            { X: Math.round(NextFigureRect.start.X / 32) + 4, Y: Math.floor(NextFigureRect.start.Y / 32) + 2 },
            { Width: 32, Height: 32 });
        this.drawFigure(ctx, figure);
    }

    ShowGameOverBanner (): void {
        const ctx = this.gameCanvas.context;

        ctx.font      = '48px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`Game Over`, 80, 40);
    }
}
