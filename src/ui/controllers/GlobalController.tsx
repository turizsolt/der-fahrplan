import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { Store } from '../../structs/Interfaces/Store';
import { VueSidebar } from './VueSidebar';
import { VueBigscreen } from './VueBigScreen';
import { VueToolbox } from './VueToolbox';
import { VueViewbox } from './VueViewbox';
import { VueTestPanel } from './VueTestPanel';
import { GUISpecificController } from './GUISpecificController';
import { InputHandler } from './InputHandlers/InputHandler';
import { ChainedInputHandler } from './InputHandlers/ChainedInputHandler';
import { InputController } from './InputController';
import { InputMode } from './InputHandlers/InputMode';
import { ToolInputHandler } from './InputHandlers/ToolInputHandler';
import { VueBigscreen2 } from './VueBigScreen2';
import { VueBigscreenMap } from './VueBigScreenMap';
import { VueBigscreenDiagram } from './VueBigScreenDiagram';
import { Overlay } from '../overlays/Overlay';
import { overlayStore } from '../overlays/store';
import { OverlayController } from '../overlays/OverlayController';

export class GlobalController {
  private viewMode: string = 'terrain';

  private vueToolbox: VueToolbox;
  private vueViewbox: VueViewbox;
  private vueBigScreen: VueBigscreen;
  private vueBigScreen2: VueBigscreen2;
  private vueBigScreenMap: VueBigscreenMap;
  private vueBigScreenDiagram: VueBigscreenDiagram;
  private vueSidebar: VueSidebar;
  private vueTestPanel: VueTestPanel;
  private toolInputHandler: ToolInputHandler;

  private overlayController: OverlayController;

  private targetPassengerCount: number = 9999999;

  private ih: InputHandler;
  private inputController: InputController;

  constructor(
    private store: Store,
    private specificController: GUISpecificController
  ) {
    this.vueSidebar = new VueSidebar(this.store);
    this.vueBigScreen = new VueBigscreen(this.store);
    this.vueBigScreen2 = new VueBigscreen2(this.store);
    this.vueBigScreenMap = new VueBigscreenMap(this.store);
    this.vueBigScreenDiagram = new VueBigscreenDiagram(this.store);
    this.vueToolbox = new VueToolbox(this);
    this.vueViewbox = new VueViewbox(this);

    this.overlayController = OverlayController.getInstance();

    const domContainer = document.querySelector('#overlay-container');
    ReactDOM.render(<Provider store={overlayStore}><Overlay /></Provider>, domContainer);

    this.toolInputHandler = new ToolInputHandler(this.vueToolbox, this.store);

    this.ih = new ChainedInputHandler(
      this.store,
      this.vueSidebar,
      this,
      this.specificController,
      this.toolInputHandler
    );
    this.inputController = new InputController(
      this.store,
      this.ih,
      this.specificController
    );

    this.vueTestPanel = new VueTestPanel(this.store);
    this.store.getCommandLog().setInputController(this);

    this.vueViewbox.addButton({ id: 'terrain', text: 'Terrain' });
    this.vueViewbox.addButton({ id: 'map', text: 'Map' });
    this.vueViewbox.addButton({ id: 'schedule', text: 'Schedule' });
    this.vueViewbox.addButton({ id: 'diagram', text: 'Diagram' });
    this.vueViewbox.addButton({ id: 'connect', text: 'Connect' });
    this.vueViewbox.addButton({ id: 'builder', text: 'Builder' });
    this.selectView('diagram');
  }

  getInputController(): InputController {
    return this.inputController;
  }

  setTargetPassenger(count: number): void {
    this.targetPassengerCount = count;
  }

  selectMode(mode: InputMode): void {
    this.toolInputHandler.selectMode(mode);
  }

  selectView(mode: string) {
    this.viewMode = mode;
    this.vueViewbox.setSelected(mode);
    this.overlayController.setOverlayMode(mode);

    if (mode === 'terrain') {
      this.vueBigScreenMap.setShow(false);
      this.selectMode(InputMode.CAMERA);
      this.vueToolbox.setShow(false);
    } else if (mode === 'builder') {
      this.vueBigScreenMap.setShow(false);
      this.selectMode(InputMode.CAMERA);
      this.vueToolbox.setShow(true);
    } else {
      this.vueBigScreenMap.setShow(true);
      this.selectMode(InputMode.SELECT);
      this.vueToolbox.setShow(false);
    }
  }

  private avgFps: number = 0;

  tick() {
    const speed = this.store.getTickSpeed();

    for (let i = 0; i < speed; i++) {

      this.store.tick();
      const tickCount = this.store.getTickCount();
      const count = Math.floor(tickCount / 60);

      if (tickCount % 60 === 0) {
        this.vueSidebar.setData(
          'tickCount',
          Math.floor(count / 60) + ':' + (count % 60 < 10 ? '0' : '') + (count % 60)
        );
        this.vueSidebar.setData('tickSpeed', speed);
        this.vueSidebar.setData('fps', (this.avgFps / 60).toFixed(2));

        const passengerStats = this.store.getPassengerStats();
        this.vueSidebar.setData('passengerCount', passengerStats.count);
        this.vueSidebar.setData(
          'passengerArrivedCount',
          passengerStats.arrivedCount
        );
        this.vueSidebar.setData(
          'passengerAverageArriveSpeed',
          Math.round(passengerStats.averageArriveSpeed * 100) / 100
        );

        if (passengerStats.arrivedCount >= this.targetPassengerCount) {
          alert('Nyertél! Elvittél ' + this.targetPassengerCount + ' utast.');
          this.targetPassengerCount = 9999999;
        }
        this.avgFps = 0;
      }

      this.avgFps += this.specificController.getFps();
    }
  }

  load(data: any, version: number) {
    this.store.loadAll(data, version);
  }

  // specific

  saveSpecific(): any {
    return this.specificController.saveSpecific();
  }

  loadSpecific(obj: any): void {
    this.specificController.loadSpecific(obj);
  }
}
