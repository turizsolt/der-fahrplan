import { InputHandler } from '../InputHandler';
import { roam, click, drag, move, drop } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { CreateStationInputHandlerPlugin } from './CreateStationInputHandlerPlugin';
import { CreateStationInputHandlerPixi } from './CreateStationInputHandlerPixi';
import { CreateStationInputHandlerBabylon } from './CreateStationInputHandlerBabylon';
import { InputProps } from '../../InputProps';
import { MouseLeft } from '../Interfaces/InputType';
import { TYPES } from '../../../../di/TYPES';
import { Station } from '../../../../structs/Scheduling/Station';
import { Circle } from '../../../../structs/Geometry/Circle';

export class CreateStationInputHandler extends InputHandler {
  private plugin: CreateStationInputHandlerPlugin;

  constructor(private store: Store) {
    super();

    // todo inject
    this.plugin =
      globalThis.startParam === '2d'
        ? new CreateStationInputHandlerPixi()
        : new CreateStationInputHandlerBabylon();
    this.plugin.init();

    this.reg(drag(MouseLeft), (legacyProps: InputProps) => {
      if (!legacyProps.snappedJoint) {
        this.plugin.setFrom(
          !legacyProps.snappedJoint && !legacyProps.snappedPositionOnTrack,
          legacyProps.snappedPoint.coord
        );
      }
      this.plugin.setTo(
        !legacyProps.snappedJoint && !legacyProps.snappedPositionOnTrack,
        legacyProps.snappedPoint.coord
      );
    });

    this.reg(roam(), (legacyProps: InputProps) => {
      if (legacyProps.snappedPoint) {
        this.plugin.setFrom(
          !legacyProps.snappedJoint && !legacyProps.snappedPositionOnTrack,
          legacyProps.snappedPoint.coord
        );
      }
    });

    this.reg(move(MouseLeft), (legacyProps: InputProps) => {
      const props = legacyProps;
      const downProps = legacyProps.downProps;

      this.plugin.setTo(!props.snappedJoint, props.snappedPoint.coord);

      if (props.snappedJoint) {
        props.snappedPoint.dirXZ = props.snappedJoint.getRotation();
      }

      if (downProps.snappedJoint) {
        downProps.snappedPoint.dirXZ = downProps.snappedJoint.getRotation();
      }
    });

    this.reg(drop(MouseLeft), (legacyProps: InputProps) => {
      const props = legacyProps;
      const downProps = legacyProps.downProps;

      if (
        !downProps.snappedPoint.coord.equalsTo(props.snappedPoint.coord) &&
        (!props.snappedJointOnTrack ||
          props.snappedJointOnTrack.position === 0 ||
          props.snappedJointOnTrack.position === 1) &&
        (!downProps.snappedJointOnTrack ||
          downProps.snappedJointOnTrack.position === 0 ||
          downProps.snappedJointOnTrack.position === 1)
      ) {
        const station = this.store.create<Station>(TYPES.Station);
        const diam = downProps.snappedPoint.coord.distance2d(
          props.snappedPoint.coord
        );
        const pt = downProps.snappedPoint.coord.midpoint(
          props.snappedPoint.coord
        );
        station.init(new Circle(pt, diam / 2));
      }
      this.plugin.up();
    });

    this.reg(click(MouseLeft), () => {
      this.plugin.click();
    });
  }

  // todo cancel(): void {
  //   this.plugin.cancel();
  // }
}
