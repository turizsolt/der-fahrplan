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
const routePlotLineGraphics: PIXI.Graphics[] = [];
const routePlotText: PIXI.Text[] = [];
const routeLineGraphics: PIXI.Graphics[] = [];
const timePlotGraphics: PIXI.Graphics[] = [];
const timePlotLineGraphics: PIXI.Graphics[] = [];
const timePlotText: PIXI.Text[] = [];
const tripPlotGraphics: PIXI.Graphics[] = [];
const tripLineGraphics: PIXI.Graphics[] = [];
let boundingRect: PIXI.Graphics = null;

let width = 500;
let height = 500;
let border = 20;
let stationHolder = 50;
let timeHolder = 10;

export class DiagramCreator {
    private static drawPlot(graphics: PIXI.Graphics, plot: RailDiagramPlot): void {
        graphics.clear();
        graphics.lineStyle(1, plot.meta?.routeColor ? 0x000000 : 0xff0000, 1);
        graphics.beginFill(plot.meta?.routeColor ? 0xffffff : 0xcfcfcf);
        graphics.drawCircle(0, 0, 3);
        graphics.endFill();
        graphics.zIndex = plot.zIndex || 5;
        graphics.x = plot.t * width + border + stationHolder;
        graphics.y = plot.r * height + border;
        graphics.renderable = true;
        // PixiClickGeneral(graphics, 'point', 'abc',
        //     (x, y, type, id) => console.log(x, y, type, id)
        // );
    }

    private static drawText(text: PIXI.Text, plot: RailDiagramPlot): void {
        text.text = plot.name;
        text.x = plot.t * width + border / 2 + 2 + stationHolder;
        text.y = plot.r * height + border;
        text.zIndex = plot.zIndex || 70;
        text.resolution = 2;
        text.anchor.x = 1;
        text.anchor.y = 0.5;
        text.style.fill = plot.meta?.routeColor || 0x000000;
        text.renderable = true;
    }

    private static drawTextTime(text: PIXI.Text, plot: RailDiagramPlot): void {
        text.text = plot.name;
        text.x = plot.t * width + border + stationHolder;
        text.y = plot.r * height + border + timeHolder / 2;
        text.zIndex = plot.zIndex || 70;
        text.resolution = 2;
        text.anchor.x = 0.5;
        text.anchor.y = 0;
        text.renderable = true;
    }

    private static drawLine(graphics: PIXI.Graphics, line: RailDiagramLine): void {
        graphics.clear();
        graphics.lineStyle(2, parseInt(line.meta?.routeColor?.slice(1), 16) || 0xff0000, 1);
        graphics.moveTo(line.from.t * width + border + stationHolder, line.from.r * height + border);
        graphics.lineTo(line.to.t * width + border + stationHolder, line.to.r * height + border);
        graphics.zIndex = line.zIndex || 4;
        graphics.renderable = true;
    }

    private static drawTimeLine(graphics: PIXI.Graphics, plot: RailDiagramPlot): void {
        graphics.clear();
        graphics.lineStyle(1, 0x9f9f9f, 0.5);
        graphics.moveTo(plot.t * width + border + stationHolder, border);
        graphics.lineTo(plot.t * width + border + stationHolder, plot.r * height + border);
        graphics.zIndex = 0;
        graphics.renderable = true;
    }

    private static drawRouteLine(graphics: PIXI.Graphics, plot: RailDiagramPlot): void {
        graphics.clear();
        graphics.lineStyle(1, 0x9f9f9f, 0.5);
        graphics.moveTo(border + stationHolder, plot.r * height + border);
        graphics.lineTo(width + border + stationHolder, plot.r * height + border);
        graphics.zIndex = 0;
        graphics.renderable = plot.meta?.hasLine === undefined || plot.meta?.hasLine === true;
    }

    static create(store: Store): void {
        const route = overlayStore.getState().overlay.selectedRoute;
        const routeVariant = getStorable(route && route.variants[0]) as RouteVariant;
        if (!routeVariant) return;

        width = globalThis.containerMap.clientWidth - 2 * border - stationHolder;
        height = globalThis.containerMap.clientHeight - 2 * border - timeHolder;

        const diagram = new RailDiagram(store);
        diagram.setRoute(routeVariant);

        const { plots: routePlots, lines: routeLines } = diagram.getRouteAxis();
        const timePlots = diagram.getTimeAxis();
        const { plots: tripPlots, lines: tripLines } = diagram.getPlotsAndLines();

        drawCycle<PIXI.Graphics, RailDiagramPlot>(tripPlotGraphics, tripPlots, createGraphics, DiagramCreator.drawPlot, eraseGraphics);
        drawCycle<PIXI.Graphics, RailDiagramLine>(tripLineGraphics, tripLines, createGraphics, DiagramCreator.drawLine, eraseGraphics);

        if (!boundingRect) {
            boundingRect = new PIXI.Graphics();

            boundingRect.clear();
            boundingRect.beginFill(0xcceecc);
            boundingRect.drawRect(0, 0, border + stationHolder, globalThis.containerMap.clientHeight);
            boundingRect.endFill();
            boundingRect.zIndex = 59;
            boundingRect.renderable = true;

            globalThis.stageMap.addChild(boundingRect);
        }

        drawCycle<PIXI.Graphics, RailDiagramPlot>(routePlotGraphics, routePlots, createGraphics, DiagramCreator.drawPlot, eraseGraphics);
        drawCycle<PIXI.Graphics, RailDiagramPlot>(routePlotLineGraphics, routePlots, createGraphics, DiagramCreator.drawRouteLine, eraseGraphics);
        drawCycle<PIXI.Text, RailDiagramPlot>(routePlotText, routePlots, createText, DiagramCreator.drawText, eraseGraphics);
        drawCycle<PIXI.Graphics, RailDiagramLine>(routeLineGraphics, routeLines, createGraphics, DiagramCreator.drawLine, eraseGraphics);
        drawCycle<PIXI.Graphics, RailDiagramPlot>(timePlotGraphics, timePlots, createGraphics, DiagramCreator.drawPlot, eraseGraphics);
        drawCycle<PIXI.Graphics, RailDiagramPlot>(timePlotLineGraphics, timePlots, createGraphics, DiagramCreator.drawTimeLine, eraseGraphics);
        drawCycle<PIXI.Text, RailDiagramPlot>(timePlotText, timePlots, createTextTime, DiagramCreator.drawTextTime, eraseGraphics);
    }
}

const createGraphics = () => {
    const graphics = new PIXI.Graphics();
    globalThis.stageDiagram.addChild(graphics);
    return graphics;
};

const settings: Partial<PIXI.ITextStyle> = {
    fontFamily: 'Arial',
    fontSize: 10,
    fill: 0x000000,
    align: 'right',
    fontWeight: '400',
};

const createText = () => {
    const text = new PIXI.Text('', settings);
    globalThis.stageDiagram.addChild(text);
    return text;
};

const createTextTime = () => {
    const text = new PIXI.Text('', { ...settings, align: 'center' });
    globalThis.stageDiagram.addChild(text);
    return text;
};

const eraseGraphics = (g: { renderable: boolean }) => {
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
