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

export class GlobalController {
  private viewMode: string = 'terrain';

  private vueToolbox: VueToolbox;
  private vueViewbox: VueViewbox;
  private vueBigScreen: VueBigscreen;
  private vueSidebar: VueSidebar;
  private vueTestPanel: VueTestPanel;
  private toolInputHandler: ToolInputHandler;

  private targetPassengerCount: number = 9999999;

  private ih: InputHandler;
  private inputController: InputController;

  constructor(
    private store: Store,
    private specificController: GUISpecificController
  ) {
    this.vueSidebar = new VueSidebar(this.store);
    this.vueBigScreen = new VueBigscreen(this.store);
    this.vueToolbox = new VueToolbox(this);
    this.vueViewbox = new VueViewbox(this);

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
    this.vueViewbox.addButton({ id: 'schedule', text: 'Schedule' });
    this.vueViewbox.addButton({ id: 'builder', text: 'Builder' });
    this.vueViewbox.setSelected('terrain');
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

    if (mode === 'schedule') {
      this.selectMode(InputMode.SELECT);
      this.vueBigScreen.setShow(true);
    } else {
      this.selectMode(InputMode.CAMERA);
      this.vueBigScreen.setShow(false);
    }

    if (mode === 'builder') {
      this.vueToolbox.setShow(true);
    } else {
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

  load(data: any) {
    this.store.loadAll(data);
  }

  // specific

  saveSpecific(): any {
    return this.specificController.saveSpecific();
  }

  loadSpecific(obj: any): void {
    this.specificController.loadSpecific(obj);
  }
}
