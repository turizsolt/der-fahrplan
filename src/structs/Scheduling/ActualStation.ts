import { ActualBaseBrick } from '../Actuals/ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { Station } from './Station';
import { Store } from '../Interfaces/Store';
import { Circle } from '../Geometry/Circle';
import { Coordinate } from '../Geometry/Coordinate';
import { Platform } from '../Interfaces/Platform';

export class ActualStation extends ActualBaseBrick implements Station {
  private name: string;
  private circle: Circle;
  private platforms: Platform[];

  init(circle: Circle): Station {
    super.initStore();
    this.circle = circle;
    this.name = this.id;
    this.platforms = [];
    this.store
      .getFiltered(x => x.constructor.name === 'ActualPlatform')
      .forEach(pl => {
        const platform = pl as Platform;
        if (
          platform.getLineSegmentChain().getIntersectionsWithCirlce(this.circle)
            .length > 0
        ) {
          this.platforms.push(platform);
        }
      });
    return this;
  }

  getPlatforms(): Platform[] {
    return this.platforms;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      circle: {
        x: this.circle.a.x,
        y: this.circle.a.y,
        z: this.circle.a.z,
        r: this.circle.r
      },
      type: 'Station',
      name: this.name
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      new Circle(
        new Coordinate(obj.circle.x, obj.circle.y, obj.circle.z),
        obj.circle.r
      )
    );
    this.setName(obj.name);
  }
}
