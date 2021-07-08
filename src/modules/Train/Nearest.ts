import { PositionOnTrack } from './PositionOnTrack';
import { Train } from './Train';
import { NearestData } from './NearestData';
import { Signal } from '../Signaling/Signal';
import { BlockJoint } from '../Signaling/BlockJoint';
import { Platform } from '../../structs/Interfaces/Platform';
import { ActualTrack } from '../Track/ActualTrack';

export class Nearest {
  static end(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 99;

    while (iter.next() && ttl) {
      iter = iter.next();
      distance += iter.getLength();
      segmentCount++;
      ttl--;
    }

    return {
      distance: ttl ? distance : Number.POSITIVE_INFINITY,
      segmentCount
    };
  }

  static singleEnd(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 999;

    while (
      iter.next() &&
      iter.next().getTrack().constructor.name === ActualTrack.name &&
      ttl
    ) {
      iter = iter.next();
      distance += iter.getLength();
      segmentCount++;
      ttl--;
    }

    return {
      distance: ttl ? distance : Number.POSITIVE_INFINITY,
      position: ttl ? new PositionOnTrack(iter, iter.getLength()) : null,
      segmentCount
    };
  }

  static train(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 100;
    let foundTrain: Train = null;

    for (let marker of iter.getMarkers()) {
      if (
        marker.position > pot.getPosition() &&
        marker.marker.type === 'Train'
      ) {
        distance = marker.position - pot.getPosition();
        foundTrain = marker.marker.train;
        break;
      }
    }

    iter = iter.next();
    while (iter && !foundTrain && ttl) {
      for (let marker of iter.getMarkers()) {
        if (marker.marker.type === 'Train') {
          distance += marker.position;
          foundTrain = marker.marker.train;
          break;
        }
      }

      if (!foundTrain) {
        distance += iter.getLength();
      }
      segmentCount++;
      ttl--;
      iter = iter.next();
    }

    return {
      distance: foundTrain ? distance : Number.POSITIVE_INFINITY,
      segmentCount,
      train: foundTrain
    };
  }

  static signal(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 100;
    let foundSignal: Signal = null;

    for (let marker of iter.getMarkers()) {
      if (
        marker.position > pot.getPosition() &&
        marker.marker.type === 'Signal'
      ) {
        distance = marker.position - pot.getPosition();
        foundSignal = marker.marker.signal;
        break;
      }
    }

    iter = iter.next();
    while (iter && !foundSignal && ttl) {
      for (let marker of iter.getMarkers()) {
        if (marker.marker.type === 'Signal') {
          distance += marker.position;
          foundSignal = marker.marker.signal;
          break;
        }
      }

      if (!foundSignal) {
        distance += iter.getLength();
      }
      segmentCount++;
      ttl--;
      iter = iter.next();
    }

    return {
      distance: foundSignal ? distance : Number.POSITIVE_INFINITY,
      segmentCount,
      signal: foundSignal
    };
  }

  static platform(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 100;
    let foundPlatform: Platform = null;

    for (let marker of iter.getMarkers()) {
      if (
        marker.position > pot.getPosition() &&
        marker.marker.type === 'Platform'
      ) {
        distance = marker.position - pot.getPosition();
        foundPlatform = marker.marker.platform;
        break;
      }
    }

    iter = iter.next();
    while (iter && !foundPlatform && ttl) {
      for (let marker of iter.getMarkers()) {
        if (marker.marker.type === 'Platform') {
          distance += marker.position;
          foundPlatform = marker.marker.platform;
          break;
        }
      }

      if (!foundPlatform) {
        distance += iter.getLength();
      }
      segmentCount++;
      ttl--;
      iter = iter.next();
    }

    return {
      distance: foundPlatform ? distance : Number.POSITIVE_INFINITY,
      segmentCount,
      platform: foundPlatform
    };
  }

  static blockJoint(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 100;
    let foundBlockJoint: BlockJoint = null;
    let foundPosition: PositionOnTrack = null;

    for (let marker of iter.getMarkers()) {
      if (
        marker.position > pot.getPosition() &&
        marker.marker.type === 'BlockJoint'
      ) {
        distance = marker.position - pot.getPosition();
        foundBlockJoint = marker.marker.blockJoint;
        foundPosition = PositionOnTrack.fromTrack(
          iter.getTrack(),
          marker.position,
          iter.getDirection()
        );
        break;
      }
    }

    iter = iter.next();
    while (iter && !foundBlockJoint && ttl) {
      for (let marker of iter.getMarkers()) {
        if (marker.marker.type === 'BlockJoint') {
          distance += marker.position;
          foundBlockJoint = marker.marker.blockJoint;
          foundPosition = PositionOnTrack.fromTrack(
            iter.getTrack(),
            marker.position,
            iter.getDirection()
          );
          break;
        }
      }

      if (!foundBlockJoint) {
        distance += iter.getLength();
      }
      segmentCount++;
      ttl--;
      iter = iter.next();
    }

    return {
      distance: foundBlockJoint ? distance : Number.POSITIVE_INFINITY,
      segmentCount,
      blockJoint: foundBlockJoint,
      position: foundPosition
    };
  }
}
