import { InputProps } from './InputProps';
import { Ray } from '../../structs/Geometry/Ray';
import { BabylonVector3ToCoordinate } from '../babylon/converters/BabylonVector3ToCoordinate';
import { TrackBase } from '../../modules/Track/TrackBase';
import { TrackJoint } from '../../modules/Track/TrackJoint/TrackJoint';
import { ActualTrack } from '../../modules/Track/ActualTrack';
import { ActualTrackSwitch } from '../../modules/Track/ActualTrackSwitch';
import { ActualTrackJoint } from '../../modules/Track/TrackJoint/ActualTrackJoint';
import {
  snapHexaXZ,
  snapPositionOnTrack,
  snapJoint
} from '../../structs/Geometry/Snap';
import { Input } from './InputHandlers/Interfaces/Input';
import { InputHandler } from './InputHandlers/InputHandler';
import { InputMod } from './InputHandlers/Interfaces/InputMod';
import { InputType } from './InputHandlers/Interfaces/InputType';
import { InputHandlerProp } from './InputHandlers/Interfaces/InputHandlerProp';
import { Store } from '../../structs/Interfaces/Store';
import { GUISpecificController } from './GUISpecificController';

export class InputController {
  private downProps: boolean = false;
  private downAt: number = 0;
  private mouseDownEvent: PointerEvent = null;

  constructor(
    private store: Store,
    private inputHandler: InputHandler,
    private specificController: GUISpecificController
  ) {
    store.setInputController(this);
  }

  // todo proper injection thingy
  convertEventToProps(event: PointerEvent): InputProps {
    const { pickedPoint, pickedMesh } = this.specificController.pick(event);

    if (!pickedPoint) {
      return {
        point: null,
        mesh: pickedMesh,
        snappedPoint: null,
        snappedPositionOnTrack: null,
        snappedJoint: null,
        snappedJointOnTrack: null
      };
    }

    const point: Ray = new Ray(BabylonVector3ToCoordinate(pickedPoint), 0); // todo fishy...
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

    return {
      point: point, // only at Platform, deciding the side
      mesh: pickedMesh, // to actually get the selected

      // snap - 6 different uses it, should place inside them
      snappedPoint: snapHexaXZ(point),
      snappedPositionOnTrack: snapPositionOnTrack(point, trackList),
      snappedJoint: snapJoint(point, jointList),
      snappedJointOnTrack: snapPositionOnTrack(snapHexaXZ(point), trackList)
    };
  }

  down(event: PointerEvent) {
    this.downProps = true;
    this.downAt = new Date().getTime();
    this.handleMouse(Input.MouseDown, event);
    this.mouseDownEvent = event;
  }

  move(event: PointerEvent) {
    const now = new Date().getTime();
    if (now - this.downAt < 500) return;

    if (this.downProps) {
      const event2 = {
        ...event,
        button: this.mouseDownEvent.button,
        ctrlKey: this.mouseDownEvent.ctrlKey,
        shiftKey: this.mouseDownEvent.shiftKey
      };
      this.handleMouse(Input.MouseMove, event2);
    } else {
      this.handleMouse(Input.MouseRoam, event);
    }
  }

  up(event: PointerEvent) {
    if (!this.downProps) return;

    const now = new Date().getTime();
    if (now - this.downAt < 500) {
      this.handleMouse(Input.MouseClick, event);
    } else {
      this.handleMouse(Input.MouseUp, event);
    }
    this.downProps = false;
  }

  private handleMouse(input: Input, event: PointerEvent): void {
    this.inputHandler.handle(
      {
        input,
        type: this.getMouseButton(event),
        mod: this.getMouseMods(event)
      },
      event
    );
  }

  // todo clean up any-s
  private getMouseMods(event: PointerEvent | WheelEvent): InputMod {
    return (event.ctrlKey || (event as any)?.data?.originalEvent?.ctrlKey)
      ? (event.shiftKey || (event as any)?.data?.originalEvent?.shiftKey)
        ? InputMod.Both
        : InputMod.Ctrl
      : (event.shiftKey || (event as any)?.data?.originalEvent?.shiftKey)
        ? InputMod.Shift
        : InputMod.None;
  }

  private getMouseButton(event: PointerEvent): InputType {
    return event.button === 0
      ? InputType.MouseLeft
      : event.button === 2
        ? InputType.MouseRight
        : InputType.MouseMiddle;
  }

  wheel(event: WheelEvent) {
    this.inputHandler.handle({
      input: Input.Wheel,
      type:
        Math.sign(event.deltaY) > 0 ? InputType.WheelPos : InputType.WheelNeg,
      mod: this.getMouseMods(event)
    });
  }

  // keyboard handling

  keyDown(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    this.inputHandler.handle(this.getHandle(Input.KeyboardDown, key, mods));
  }

  keyUp(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    this.inputHandler.handle(this.getHandle(Input.KeyboardUp, key, mods));
  }

  keyHold(key: string, mods: { shift: boolean; ctrl: boolean }): void {
    this.inputHandler.handle(this.getHandle(Input.KeyboardHold, key, mods));
  }

  // tick

  tick() {
    this.inputHandler.handle(this.getTick());
  }

  private getHandle(
    input: Input,
    key: string,
    mods: { shift: boolean; ctrl: boolean }
  ): InputHandlerProp {
    return {
      input: input,
      type: key,
      mod: this.getMods(mods)
    };
  }

  private getMods(mods: { shift: boolean; ctrl: boolean }): InputMod {
    return mods.shift
      ? mods.ctrl
        ? InputMod.Both
        : InputMod.Shift
      : mods.ctrl
        ? InputMod.Ctrl
        : InputMod.None;
  }

  private getTick(): InputHandlerProp {
    return {
      input: Input.Tick,
      type: InputType.MouseAny,
      mod: InputMod.DontCare
    };
  }
}
