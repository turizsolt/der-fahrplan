import * as PIXI from 'pixi.js';
import { RailDiagram } from '../../modules/RailDiagram/RailDiagram';
import { RailDiagramLine } from '../../modules/RailDiagram/RailDiagramLine';
import { RailDiagramPlot } from '../../modules/RailDiagram/RailDiagramPlot';
import { getStorable } from '../../structs/Actuals/Store/StoreForVue';
import { Store } from "../../structs/Interfaces/Store";
import { RouteVariant } from '../../structs/Scheduling/RouteVariant';
import { PixiClickGeneral } from '../babylon/PixiClick';
import { overlayStore } from './store';

const routePlotGraphics: PIXI.Graphics[] = [];
const routeLineGraphics: PIXI.Graphics[] = [];
const timePlotGraphics: PIXI.Graphics[] = [];

export class DiagramCreator {
    private static drawPlot(graphics: PIXI.Graphics, plot: RailDiagramPlot): void {
        graphics.clear();
        graphics.lineStyle(1, 0xff0000, 1);
        graphics.beginFill(0xcfcfcf);
        graphics.drawCircle(0, 0, 10);
        graphics.endFill();
        graphics.zIndex = 5;
        graphics.x = plot.t * 500 + 40;
        graphics.y = plot.r * 500 + 40;
        graphics.renderable = true;

        // PixiClickGeneral(graphics, 'point', 'abc',
        //     (x, y, type, id) => console.log(x, y, type, id)
        // );
    }

    private static drawLine(graphics: PIXI.Graphics, line: RailDiagramLine): void {
        graphics.clear();
        graphics.lineStyle(1, 0xff0000, 1);
        graphics.moveTo(line.from.t * 500 + 40, line.from.r * 500 + 40);
        graphics.lineTo(line.to.t * 500 + 40, line.to.r * 500 + 40);
        graphics.zIndex = 4;
        graphics.renderable = true;
    }

    static create(store: Store): void {
        const route = overlayStore.getState().overlay.selectedRoute;
        const routeVariant = getStorable(route && route.variants[0]) as RouteVariant;
        if (!routeVariant) return;

        const diagram = new RailDiagram(store);
        diagram.setRoute(routeVariant);

        const { plots: routePlots, lines: routeLines } = diagram.getRouteAxis();
        const timePlots = diagram.getTimeAxis();

        drawCycle<PIXI.Graphics, RailDiagramPlot>(routePlotGraphics, routePlots, createGraphics, DiagramCreator.drawPlot, eraseGraphics);
        drawCycle<PIXI.Graphics, RailDiagramLine>(routeLineGraphics, routeLines, createGraphics, DiagramCreator.drawLine, eraseGraphics);
        drawCycle<PIXI.Graphics, RailDiagramPlot>(timePlotGraphics, timePlots, createGraphics, DiagramCreator.drawPlot, eraseGraphics);
    }
}

const createGraphics = () => {
    const graphics = new PIXI.Graphics();
    globalThis.stageDiagram.addChild(graphics);
    return graphics;
};
const eraseGraphics = (g: PIXI.Graphics) => {
    g.renderable = false;
}

function drawCycle<M, D>(memory: M[], data: D[], create: () => M, write: (m: M, d: D) => void, erase: (m: M) => void): void {
    let i = 0;
    for (; i < data.length; i++) {
        if (!memory[i]) {
            memory.push(create());
        }
        write(memory[i], data[i]);
    }

    for (; i < memory.length; i++) {
        erase(memory[i]);
    }
};
