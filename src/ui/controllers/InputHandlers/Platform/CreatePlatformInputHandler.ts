import { InputHandler } from '../InputHandler';
import { roam, click, drag, move, drop } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { CreatePlatformInputHandlerPlugin } from './CreatePlatformInputHandlerPlugin';
import { CreatePlatformInputHandlerPixi } from './CreatePlatformInputHandlerPixi';
import { CreatePlatformInputHandlerBabylon } from './CreatePlatformInputHandlerBabylon';
import { ActualTrack } from '../../../../modules/Track/ActualTrack';
import { InputProps } from '../../InputProps';
import { MouseLeft } from '../Interfaces/InputType';
import { Platform } from '../../../../structs/Interfaces/Platform';
import { TYPES } from '../../../../di/TYPES';
import { Side } from '../../../../structs/Interfaces/Side';

export class CreatePlatformInputHandler extends InputHandler {
  private plugin: CreatePlatformInputHandlerPlugin;
  private downProps: InputProps;

  constructor(private store: Store) {
    super();

    // todo inject
    this.plugin =
      globalThis.startParam === '2d'
        ? new CreatePlatformInputHandlerPixi()
        : new CreatePlatformInputHandlerBabylon();
    this.plugin.init();

    this.reg(drag(MouseLeft), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const pot = legacyProps.snappedPositionOnTrack;
      if (pot && pot.track.constructor.name === ActualTrack.name) {
        const point = pot.track
          .getCurve()
          .getBezier()
          .getPoint(pot.position);
        this.plugin.down(!!pot, point);
      } else {
        this.plugin.down(false);
      }

      this.downProps = legacyProps;
    });

    this.reg(roam(), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const pot = legacyProps.snappedPositionOnTrack;
      if (pot && pot.track.constructor.name === ActualTrack.name) {
        const point = pot.track
          .getCurve()
          .getBezier()
          .getPoint(pot.position);

        this.plugin.roam(!!pot, point);
      } else {
        this.plugin.roam(false);
      }
    });

    this.reg(move(MouseLeft), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const pot = legacyProps.snappedPositionOnTrack;
      if (pot && pot.track.constructor.name === ActualTrack.name) {
        const point = pot.track
          .getCurve()
          .getBezier()
          .getPoint(pot.position);

        // todo indicate side

        //   const a = pot.track.getSegment().getFirstPoint();
        //   const b = pot.track.getSegment().getLastPoint();
        //   const p = props.point.coord;
        //   const side = Math.sign(
        //     (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x)
        //   );

        // console.log(side);

        this.plugin.move(!!pot, point);
      } else {
        this.plugin.move(false);
      }
    });

    this.reg(drop(MouseLeft), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const props = legacyProps;
      const downProps = this.downProps;

      const pot = props.snappedPositionOnTrack;
      const dpot = downProps.snappedPositionOnTrack;

      if (
        pot &&
        dpot &&
        pot.track.constructor.name === ActualTrack.name &&
        pot.track === dpot.track &&
        pot.position !== dpot.position
      ) {
        const a = pot.track.getCurve().getFirstPoint();
        const b = pot.track.getCurve().getLastPoint();
        const p = props.point.coord;
        const side = Math.sign(
          (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x)
        );

        // console.log(side, p.x, p.y, p.z);

        const pl = this.store
          .create<Platform>(TYPES.Platform)
          .init(
            pot.track,
            Math.min(pot.position, dpot.position),
            Math.max(pot.position, dpot.position),
            side > 0 ? Side.Left : Side.Right,
            7.5
          );
      }
      this.plugin.up();

      this.downProps = null;
    });

    this.reg(click(MouseLeft), () => {
      this.plugin.click();
    });
  }

  // todo cancel(): void {
  //   this.plugin.cancel();
  // }
}
