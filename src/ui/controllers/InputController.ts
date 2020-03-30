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
import { babylonContainer } from '../../structs/inversify.config';
import { TYPES } from '../../structs/TYPES';
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
        buttons: []
      },
      methods: {
        handleClick: function(event) {
          _this.selectMode(event.target.id);
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
        <div>Wagon #{{idt}}</div>
        <div v-if="obj.getTrip()">
          <div>Trip: {{obj.getTrip().getName()}} </div>
          <div v-for="stop in obj.getTrip().getStops()">{{stop.getStationName()}} </div>
        </div>
        <div v-else>
        <div>Select a trip:</div>
        <div v-for="route in opts" @click="assignRoute(obj, route)">{{route.getDetailedName()}} </div>
        <div v-if="!opts || opts.length === 0">No trip available...</div>
        
        </div>
      </div>
      `,
      methods: {
        assignRoute: function(wagon: Wagon, route: Route) {
          wagon.assignTrip(route);
          this.obj = wagon;
        }
      }
    });

    this.vmBigScreen = new Vue({
      el: '#big-screen',
      data: {
        show: false,
        routes: [
          // { id: 'dfse34fgsf', name: 'B12', stops: [] },
          // { id: 'assddferj', name: 'B12', stops: [] }
        ],
        selectedRoute: null,
        stations: [
          //   { id: 'sewtew', name: 'Algarra' },
          //   { id: 'fdsfds', name: 'Burito' },
          //   { id: 'rt3trw', name: 'Cheddar' },
          //   { id: '65443e', name: 'Dorito' }
        ]
      },
      methods: {
        load: function() {
          //this.routes = _this.store.getAllOf<Route>(TYPES.Route);
          //this.stations = _this.store.getAllOf<Station>(TYPES.Station);
        },
        fromTo: function(route) {
          return route.getDetailedName();
        },
        removeRoute: function(route) {
          route.remove();
          this.load();
        },
        createRoute: function() {
          const route = _this.store.create<Route>(TYPES.Route);
          route.init();
          this.load();
        },
        createReverseRoute: function(route) {
          //   this.routes.push({
          //     id: route.id + '1',
          //     name: route.name,
          //     stops: [...route.stops].reverse()
          //   });
        },
        selectRoute: function(route) {
          this.selectedRoute = route;
          this.load();
        },
        deleteStop: function(stop) {
          this.selectedRoute.removeStop(stop);
          this.load();
        },
        swapStop: function(stop) {
          this.selectedRoute.swapStopWithPrev(stop);
          this.load();
        },
        addStop: function(station) {
          if (this.selectedRoute) {
            const stop = _this.store.create<RouteStop>(TYPES.RouteStop);
            stop.init(
              station,
              station.getPlatforms().length > 0 && station.getPlatforms()[0]
            );
            this.selectedRoute.addStop(stop);
            this.load();
          }
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
    this.store = babylonContainer.get<() => Store>(TYPES.FactoryOfStore)();
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
        fromZ: this.camera.position.z
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
      fromZ: this.camera.position.z
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

  private selectIfPossible(event: PointerEvent) {
    let ready = false;
    if (this.downProps.mesh) {
      let meshId = this.downProps.mesh.id;
      if (meshId.includes('.')) {
        meshId = meshId.slice(0, meshId.indexOf('.'));
      }
      console.log(meshId);
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
              renderer.setSelected(false);
              this.selected = null;
              this.selectedMesh = null;
              this.vmInfoBox.selected = null;
              this.vmInfoBox.type = null;
              this.vmInfoBox.opts = [];
            } else {
              if (this.selected) {
                this.selected.getRenderer().setSelected(false);
              }
              renderer.setSelected(true);
              this.selected = storedObj;
              this.selectedMesh = this.downProps.mesh;
              //  this.vmInfoBox.selected = storedObj;
              //   this.vmInfoBox.type =
              //     storedObj.getType() === Symbol.for('Wagon')
              //       ? 'wagon'
              //       : 'idtext';
              //   console.log('gt', storedObj.getType(), this.vmInfoBox.type);
              //   if (storedObj.getType() === Symbol.for('Wagon')) {
              //     this.vmInfoBox.opts = this.store.getAllOf<Route>(TYPES.Route);
              //   }

              //   const sel = this.selected as any;
              //   if (sel.getName) {
              //     this.vmInfoBox.selectedId = sel.getName();
              //     if (sel.getPlatforms) {
              //       this.vmInfoBox.selectedId =
              //         sel.getName() +
              //         ' / ' +
              //         sel
              //           .getPlatforms()
              //           .map(p => p.getId())
              //           .join(', ');
              //     }
              //   } else if (sel.getStation) {
              //     this.vmInfoBox.selectedId =
              //       id +
              //       ':' +
              //       (!sel.getStation()
              //         ? 'No station'
              //         : sel.getStation().getName());
              //   } else {
              //     this.vmInfoBox.selectedId = id;
              //   }
            }
          }
          ready = true;
        }
      }
    }
    return ready;
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

  keyDown(key: string, mods: { shift: boolean; ctrl: boolean }): void {}

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
      case 'ArrowUp':
        this.selected.getRenderer().process('forward');
        break;

      case 'ArrowDown':
        this.selected.getRenderer().process('backward');
        break;
    }
  }

  load(data: any) {
    this.store.loadAll(data);
  }
}
