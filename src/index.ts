import { Game } from './game/Game';

const gameCanvas: HTMLCanvasElement      = <HTMLCanvasElement>document.getElementById('game');
const dashboardCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('dashboard');

const game = new Game(gameCanvas, dashboardCanvas);

game.Start();
