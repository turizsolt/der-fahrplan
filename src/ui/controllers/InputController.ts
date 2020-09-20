import * as BABYLON from 'babylonjs';
import Vue from 'vue/dist/vue.js';
import { InputHandler } from './InputHandler';
import { CreateTrackInputHandler } from './CreateTrackInputHandler';
import { BabylonVector3ToCoordinate } from '../../ui/babylon/converters/BabylonVector3ToCoordinate';
import { Ray } from '../../structs/Geometry/Ray';
import {
  snapXZ,
  snapPositionOnTrack,
  snapJoint
} from '../../structs/Geometry/Snap';
import { productionContainer } from '../../di/production.config';
import { TYPES } from '../../di/TYPES';
import { ActualTrack } from '../../structs/Actuals/Track/ActualTrack';
import { TrackBase } from '../../structs/Interfaces/TrackBase';
import { TrackJoint } from '../../structs/Interfaces/TrackJoint';
import { ActualTrackJoint } from '../../structs/Actuals/TrackJoint/ActualTrackJoint';
import { InputProps } from './InputProps';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { ActualTrackSwitch } from '../../structs/Actuals/Track/ActualTrackSwitch';
import { CameraInputHandler } from './CameraInputHandler';
import { SelectInputHandler } from './SelectInputHandler';
import { CreatePlatformInputHandler } from './CreatePlatformInputHandler';
import { CreateEngineInputHandler } from './CreateEngineInputHandler';
import { Store } from '../../structs/Interfaces/Store';
import { CreateStationInputHandler } from './CreateStationInputHandler';
import { Route } from '../../structs/Scheduling/Route';
import { Station } from '../../structs/Scheduling/Station';
import { ActualRouteStop } from '../../structs/Scheduling/ActualRouteStop';
import { RouteStop } from '../../structs/Scheduling/RouteStop';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { ActualWagon } from '../../structs/Actuals/Wagon/ActualWagon';

export enum InputMode {
  CAMERA = 'CAMERA',
  SELECT = 'SELECT',
  CREATE_TRACK = 'CREATE_TRACK',
  CREATE_PLATFORM = 'CREATE_PLATFORM',
  CREATE_ENGINE = 'CREATE_ENGINE',
  CREATE_STATION = 'CREATE_STATION'
}

export class InputController {
  private mode: InputMode = InputMode.CAMERA;
  private store: Store;

  private inputHandler: InputHandler;
  private inputHandlers: Record<InputMode, InputHandler>;

  private downProps: InputProps;
  private selectedMesh: BABYLON.AbstractMesh;
  private selected: BaseBrick;

  private mouseButtons: boolean[] = [];

  private vm: Vue;
  private vmInfoBox: Vue;
  private vmBigScreen: Vue;

  constructor(
    private scene: BABYLON.Scene,
    private camera: BABYLON.ArcRotateCamera
  ) {
    const _this = this;
    this.vm = new Vue({
      el: '#button-holder',
      data: {
        selected: '',
        buttons: [],
        wagon: 'wagon'
      },
      methods: {
        handleClick: function(event) {
          _this.selectMode(event.target.id);
        },
        handleWagonClick: function(event) {
          this.wagon = event.target.value;
        }
      }
    });
    this.vmInfoBox = new Vue({
      el: '#info-box',
      data: { selected: null, type: null, opts: [] }
    });

    Vue.component('idtext', {
      props: ['idt', 'obj'],
      template: '<div>{{idt}}</div>'
    });

    Vue.component('wagon', {
      props: ['idt', 'obj', 'opts'],
      template: `
      <div>
        <div class="item-type">🚂 Mozdony</div>
        <div class="item-id">{{idt}}</div>
        <div class="item-id">Speed: {{obj.speed ? obj.speed : '???'}}</div>
        <div v-if="obj.trip">
          <div class="trip">
            <div class="trip-name">{{obj.trip.name}}</div> 
            <div class="trip-destination">▶ {{obj.trip.destination}}</div> 
          </div>
          <div v-for="(stop, id) in obj.trip.stops">
            <div class="stop">
                <div class="stop-circle" :style="{backgroundColor: stop.rgbColor}"></div>
                <div v-if="id !== obj.trip.stops.length-1" class="stop-after color"></div>
                <div v-if="id === obj.trip.stops.length-1" class="stop-after nocolor"></div>
                <div class="stop-name">{{stop.stationName}}</div>
            </div>
          </div>
          <div class="trip-buttons">
            <div class="trip-buttons-inner">
              <div class="xbutton trip-cancel" @click="removeRoute(obj)">❌ Útirány törlése</div>
              <div v-if="obj.trip.reverse" class="xbutton trip-reverse" @click="reverseRoute(obj)">↩ Ellenirány</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="opts && opts.length > 0">
            <div>Útirány kiválasztása...</div>
            <div class="route-line" v-for="route in opts" @click="assignRoute(obj, route.id)"> 
              <div class="route-sign">{{route.name}}</div>
              <div class="route-circle route-circle-left" :style="{backgroundColor: route.stops[0].rgbColor}"></div>
              <div class="route-circle route-circle-right" :style="{backgroundColor: route.stops[route.stops.length-1].rgbColor}"></div>
              <div class="route-name">
                {{route.stops[0].stationName}}
                >
                {{route.stops[route.stops.length-1].stationName}}
              </div>
            </div>
          </div>
          <div v-if="!opts || opts.length === 0">
          <select class="route-select" size="1" disabled>
              <option>Nincs kiválsztható útirány</option>
            </select>
          </div>
        </div>
      </div>
      `,
      methods: {
        assignRoute: function(vWagon, vRouteId) {
          if (!vRouteId) return;
          const wagon = _this.store.get(vWagon.id) as Wagon;
          const route = _this.store.get(vRouteId) as Route;
          wagon.assignTrip(route);
        },
        removeRoute: function(vWagon) {
          const wagon = _this.store.get(vWagon.id) as Wagon;
          wagon.cancelTrip();
        },
        reverseRoute: function(vWagon) {
          const wagon = _this.store.get(vWagon.id) as Wagon;
          wagon.reverseTrip();
        }
      }
    });

    this.vmBigScreen = new Vue({
      el: '#big-screen',
      data: {
        show: false,
        routes: [],
        selectedRoute: null,
        stations: []
      },
      methods: {
        load: function() {
          this.routes = _this.store
            .getAllOf<Route>(TYPES.Route)
            .map(x => x.persistDeep());
          this.stations = _this.store
            .getAllOf<Station>(TYPES.Station)
            .map(x => x.persistDeep());
          if (this.selectedRoute) {
            this.selectedRoute = (_this.store.get(
              this.selectedRoute.id
            ) as Route).persistDeep();
          }
        },
        removeRoute: function(vRoute) {
          const route = _this.store.get(vRoute.id) as Route;
          route.remove();
          this.selectedRoute = null;
          this.load();
        },
        createRoute: function() {
          const route = _this.store.create<Route>(TYPES.Route);
          route.init();
          this.load();
        },
        createReverseRoute: function(vRouteFrom) {
          const routeFrom = _this.store.get(vRouteFrom.id) as Route;
          const route = _this.store.create<Route>(TYPES.Route);
          route.init();
          route.setName(routeFrom.getName());
          for (let stopFrom of [...routeFrom.getStops()].reverse()) {
            const stop = _this.store.create<RouteStop>(TYPES.RouteStop);
            stop.init(stopFrom.getStation(), stopFrom.getPlatform());
            route.addStop(stop);
          }
          this.load();
        },
        selectRoute: function(route) {
          this.selectedRoute = route;
          this.load();
        },
        deleteStop: function(stop) {
          const route = _this.store.get(this.selectedRoute.id) as Route;
          route.removeStop(stop);
          this.load();
        },
        swapStop: function(vStop) {
          const stop = _this.store.get(vStop.id) as RouteStop;
          const route = _this.store.get(this.selectedRoute.id) as Route;
          route.swapStopWithPrev(stop);
          this.load();
        },
        addStop: function(vStation) {
          if (this.selectedRoute) {
            const route = _this.store.get(this.selectedRoute.id) as Route;
            const station = _this.store.get(vStation.id) as Station;
            const stop = _this.store.create<RouteStop>(TYPES.RouteStop);
            stop.init(
              station,
              station.getPlatforms().length > 0 && station.getPlatforms()[0]
            );
            route.addStop(stop);
            this.load();
          }
        },
        nameChange: function(event) {
          const route = _this.store.get(this.selectedRoute.id) as Route;
          route.setName(event.target.value);
          this.load();
        }
      }
    });

    this.inputHandlers = {
      [InputMode.CAMERA]: new CameraInputHandler(camera),
      [InputMode.SELECT]: new SelectInputHandler(),
      [InputMode.CREATE_TRACK]: new CreateTrackInputHandler(),
      [InputMode.CREATE_PLATFORM]: new CreatePlatformInputHandler(),
      [InputMode.CREATE_ENGINE]: new CreateEngineInputHandler(),
      [InputMode.CREATE_STATION]: new CreateStationInputHandler()
    };

    const modeNames = {
      [InputMode.CAMERA]: 'Cam',
      [InputMode.SELECT]: 'Sel',
      [InputMode.CREATE_TRACK]: '+Trac',
      [InputMode.CREATE_PLATFORM]: '+Plat',
      [InputMode.CREATE_ENGINE]: '+Eng',
      [InputMode.CREATE_STATION]: '+Stat'
    };

    for (let mode of Object.keys(this.inputHandlers)) {
      this.vm.buttons.push({ id: mode, text: modeNames[mode] });
    }
    this.vm.selected = this.mode;

    this.inputHandler = this.inputHandlers[this.mode];

    this.downProps = null;
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
  }

  convert(event: PointerEvent): InputProps {
    const { pickedPoint, pickedMesh } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    if (!pickedPoint) {
      const ret = {
        point: null,
        mesh: pickedMesh,
        snappedPoint: null,
        snappedPositionOnTrack: null,
        snappedJoint: null,
        snappedJointOnTrack: null,
        wheelDeg: this.wheelRotation,
        wheelRad: (this.wheelRotation / 180) * Math.PI,
        selected: this.selected,
        selectedMesh: this.selectedMesh,
        cameraRadius: this.camera.radius,
        cameraAlpha: this.camera.alpha,
        cameraBeta: this.camera.beta,
        pointerX: this.scene.pointerX,
        pointerY: this.scene.pointerY,
        targetX: this.camera.target.x,
        targetZ: this.camera.target.z,
        fromX: this.camera.position.x,
        fromY: this.camera.position.y,
        fromZ: this.camera.position.z,
        wagonType: this.vm.wagon
      };

      return ret;
    }

    const point: Ray = new Ray(BabylonVector3ToCoordinate(pickedPoint), 0);
    const list = this.store.getAll();
    const trackList: TrackBase[] = [];
    const jointList: TrackJoint[] = [];
    for (let elem of Object.keys(list)) {
      if (
        list[elem].constructor.name === ActualTrack.name ||
        list[elem].constructor.name === ActualTrackSwitch.name
      ) {
        trackList.push(list[elem] as TrackBase);
      }
      if (list[elem].constructor.name === ActualTrackJoint.name) {
        jointList.push(list[elem] as TrackJoint);
      }
    }

    const ret = {
      point: point,
      mesh: pickedMesh,
      snappedPoint: snapXZ(point),
      snappedPositionOnTrack: snapPositionOnTrack(point, trackList),
      snappedJoint: snapJoint(point, jointList),
      snappedJointOnTrack: snapPositionOnTrack(snapXZ(point), trackList),
      wheelDeg: this.wheelRotation,
      wheelRad: (this.wheelRotation / 180) * Math.PI,
      selected: this.selected,
      selectedMesh: this.selectedMesh,
      cameraRadius: this.camera.radius,
      cameraAlpha: this.camera.alpha,
      cameraBeta: this.camera.beta,
      pointerX: this.scene.pointerX,
      pointerY: this.scene.pointerY,
      targetX: this.camera.target.x,
      targetZ: this.camera.target.z,
      fromX: this.camera.position.x,
      fromY: this.camera.position.y,
      fromZ: this.camera.position.z,
      wagonType: this.vm.wagon
    };
    ret.snappedPoint.dirXZ = ret.wheelRad;

    return ret;
  }

  down(event: PointerEvent) {
    const props = this.convert(event);
    this.downProps = props;
    this.inputHandler.down(props, event);
  }

  move(event: PointerEvent) {
    const props = this.convert(event);
    if (this.downProps) {
      this.inputHandler.move(this.downProps, props, event);
    } else {
      this.inputHandler.roam(props, event);
    }
  }

  up(event: PointerEvent) {
    if (!this.downProps) return;

    let props = this.convert(event);

    if (
      this.downProps.point &&
      props.point &&
      this.downProps.point.coord.equalsTo(props.point.coord)
    ) {
      let ready = this.selectIfPossible(event);
      if (ready) {
        this.inputHandler.cancel();
      } else {
        this.inputHandler.click(this.downProps, event);
      }
    } else {
      this.inputHandler.up(this.downProps, props, event);
    }
    this.downProps = null;
  }

  private wheelRotation = 0;

  private selectCallback: (ob: Object) => void = null;

  private selectIfPossible(event: PointerEvent) {
    let ready = false;
    if (this.downProps.mesh) {
      let meshId = this.downProps.mesh.id;
      if (meshId.includes('.')) {
        meshId = meshId.slice(0, meshId.indexOf('.'));
      }
      //   console.log(meshId);
      if (meshId.startsWith('clickable-')) {
        const [_, type, id, command] = meshId.split('-');
        const storedObj = this.store.get(id) as BaseBrick;
        if (storedObj) {
          if (command) {
            storedObj.getRenderer().process(command);
          } else if (event.button === 2) {
            storedObj.getRenderer().process('switch');
          } else {
            let renderer = storedObj.getRenderer();
            if (renderer.isSelected()) {
              if (
                this.selectCallback &&
                this.selected.getType() === Symbol.for('Wagon')
              ) {
                (this.selected as Wagon).unsubscribeToUpdates(
                  this.selectCallback
                );
              }

              renderer.setSelected(false);
              this.selected = null;
              this.selectedMesh = null;
              this.vmInfoBox.selected = null;
              this.vmInfoBox.type = null;
              this.vmInfoBox.opts = [];
            } else {
              this.select(storedObj);
            }
          }
          ready = true;
        }
      }
    }
    return ready;
  }

  select(storedObj: BaseBrick) {
    if (this.selected) {
      if (
        this.selectCallback &&
        this.selected.getType() === Symbol.for('Wagon')
      ) {
        (this.selected as Wagon).unsubscribeToUpdates(this.selectCallback);
      }
      this.selected.getRenderer().setSelected(false);
    }

    storedObj.getRenderer().setSelected(true);

    this.selected = storedObj;
    this.selectedMesh = null;

    if (storedObj.getType() === Symbol.for('Wagon')) {
      this.selectCallback = (obj: Object): void => {
        //   console.log('update');
        this.vmInfoBox.selected = obj;
      };
      (this.selected as Wagon).subscribeToUpdates(this.selectCallback);
    }
    this.vmInfoBox.selected = storedObj.persistDeep();
    this.vmInfoBox.type =
      storedObj.getType() === Symbol.for('Wagon') ? 'wagon' : 'idtext';
    //   console.log('gt', storedObj.getType(), this.vmInfoBox.type);
    if (storedObj.getType() === Symbol.for('Wagon')) {
      this.vmInfoBox.opts = this.store
        .getAllOf<Route>(TYPES.Route)
        .map(x => x.persistDeep());
    }
  }

  wheel(event: WheelEvent) {
    if (this.mouseButtons[1]) {
      this.camera.radius += 5 * Math.sign(event.deltaY);
    } else {
      const changeBy = 45 * Math.sign(event.deltaY);
      this.wheelRotation += changeBy;
      if (this.wheelRotation < -180) this.wheelRotation += 360;
      if (this.wheelRotation > 180) this.wheelRotation -= 360;

      const props = this.convert(null);
      if (props.point) this.move(null);
    }
  }

  selectMode(mode: InputMode) {
    this.inputHandler.cancel();
    this.mode = mode;
    this.inputHandler = this.inputHandlers[this.mode];
    this.vm.selected = mode;
  }

  keyDown(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    if (!this.selected) return;

    switch (key) {
      case 'ArrowUp':
        this.selected.getRenderer().process('forward');
        break;

      case 'ArrowDown':
        this.selected.getRenderer().process('backward');
        break;
    }
  }

  keyUp(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    switch (key) {
      case 'U':
        this.selectMode(InputMode.CAMERA);
        break;

      case 'I':
        this.selectMode(InputMode.SELECT);
        break;

      case 'O':
        this.selectMode(InputMode.CREATE_TRACK);
        break;

      case 'P':
        this.selectMode(InputMode.CREATE_PLATFORM);
        break;

      case '7':
        this.vmBigScreen.show = !this.vmBigScreen.show;
        if (this.vmBigScreen.show) {
          this.vmBigScreen.load();
        }
        break;

      case '8':
        this.selectMode(InputMode.CREATE_ENGINE);
        break;

      case '9':
        this.selectMode(InputMode.CREATE_STATION);
        break;

      case 'K':
        const download = (content, fileName, contentType) => {
          var a = document.createElement('a');
          var file = new Blob([content], { type: contentType });
          a.href = URL.createObjectURL(file);
          a.download = fileName;
          a.click();
        };

        const data = {
          data: this.store.persistAll(),
          _version: 1,
          _format: 'fahrplan'
        };

        const fileName = `${new Date().toISOString()}.${(Math.random() *
          90000) |
          (0 + 100000)}.fahrplan`;

        download(JSON.stringify(data), fileName, 'application/json');
        break;
    }

    if (!this.selected) return;

    switch (key) {
      case 'ArrowRight':
        if (this.selected.getType() === TYPES.Wagon) {
          const sel = this.selected as ActualWagon;
          if (!sel.isOneFree()) {
            this.selected.getRenderer().process('swapSide');
          } else {
            // van-e helyette mas
            sel
              .getTrain()
              .getWagons()
              .map(wagon => {
                if (wagon !== sel && wagon.isOneFree()) {
                  this.select(wagon);
                }
              });
          }
        }
        break;

      case 'R':
        this.selected.getRenderer().process('reverseTrip');
        break;

      case 'Z':
        this.selected.getRenderer().process('swapEnds');
        break;

      case '/':
        this.selected.getRenderer().process('detach');
        break;

      case 'Delete':
        this.selected.getRenderer().process('delete');
        break;

      case 'Enter':
        this.selected.getRenderer().process('stop');
        break;

      case 'S':
        this.selected.getRenderer().process('switch');
        break;
    }
  }

  keyHold(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    if (!this.selected) return;

    switch (key) {
      case 'C':
        this.selected.getRenderer().process('shuntForward');
        break;

      case 'V':
        this.selected.getRenderer().process('shuntBackward');
        break;
    }
  }

  tick() {
    this.store.getAllOf(TYPES.Wagon).map((wagon: Wagon) => {
      wagon.tick();
    });
  }

  load(data: any) {
    this.store.loadAll(data);
  }
}
