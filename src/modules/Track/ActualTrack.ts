import { TrackRenderer } from '../../structs/Renderers/TrackRenderer';
import { TYPES } from '../../di/TYPES';
import { Track } from './Track';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { ActualTrackSegment } from './ActualTrackSegment';
import { TrackEnd } from './TrackEnd';
import { TrackCurve } from './TrackCurve';
import { TrackSegmentData } from './TrackSegmentData';
import { TrackDirection } from './TrackDirection';
import { DirectedTrack } from './DirectedTrack';
import { TrackJoint } from './TrackJoint/TrackJoint';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackSegment } from './TrackSegment';
import { detectTrackType } from './DetectTrackType';

@injectable()
export class ActualTrack extends ActualTrackBase implements Track {
  protected segment: ActualTrackSegment;
  protected trackType: string;

  @inject(TYPES.TrackRenderer) private renderer: TrackRenderer;

  init(segmentData: TrackSegmentData): Track {
    super.initStore(TYPES.Track);

    this.trackType = detectTrackType(segmentData);

    this.segment = new ActualTrackSegment(this, segmentData);
    this.segment.connect();

    // todo emit
    this.renderer.init(this);
    return this;
  }

  getTrackType(): string {
    return this.trackType;
  }

  getDirected(direction: TrackDirection): DirectedTrack {
    return this.segment.getDirected(direction);
  }

  getActiveSegment(): TrackSegment {
    return this.segment;
  }

  getHash(segment?: TrackSegment): string {
    return this.id;
  }

  getCurve(): TrackCurve {
    return this.segment.getCurve();
  }

  getAx(): TrackEnd {
    return this.segment.getEnd(WhichEnd.A);
  }

  getBx(): TrackEnd {
    return this.segment.getEnd(WhichEnd.B);
  }

  // todo emit
  update(): void {
    this.renderer.update();
  }

  remove(): boolean {
    if (this.getDirected(TrackDirection.AB).getMarkers().length > 0) return false;
    if (this.getDirected(TrackDirection.BA).getMarkers().length > 0) return false;

    const removable = super.remove();
    if (removable) {
      this.renderer.remove();
      this.segment.remove();

      // todo emit
      this.store.unregister(this);
    }
    return removable;
  }

  // todo remove when possible
  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'Track',
      segmentData: this.segment.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(toSegmentData(obj.segmentData, store));
  }
}

export function toSegmentData(data: any, store: Store): TrackSegmentData {
  return {
    startJointEnd: {
      end: data.startJointEnd.end,
      joint: store.get(data.startJointEnd.joint) as TrackJoint
    },
    endJointEnd: {
      end: data.endJointEnd.end,
      joint: store.get(data.endJointEnd.joint) as TrackJoint
    },
    coordinates: data.coordinates.map(c => new Coordinate(c.x, c.y, c.z))
  };
}
