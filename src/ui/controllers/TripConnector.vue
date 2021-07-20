<template>
  <div>
    <div>
      Trip Connector
    </div>
    <table>
      <tr class="xyz" :key="t.key" v-for="t in tripsWithEnd">
        <td v-if="!t.Last" colspan="5"></td>
        <td v-if="t.Last">{{t.Last.trip.id}}</td> 
        <td v-if="t.Last">{{t.Last.trip.route.detailedName}}</td> 
        <td v-if="t.Last">{{t.Last.trip.route.name}}</td>  
        <td v-if="t.Last">{{t.Last.timeStr}}</td>  
        <td v-if="t.Last" class="blue box" @click="copy(t.Last.trip.id)">{{t.Last.trip.nextTrip}}</td>  
        
        <td v-if="!t.Last || !t.Last.trip.nextTrip"></td>
        <td v-if="t.Last && t.Last.trip.nextTrip" class="box" @click="toggleReverse(t.Last.trip.id)">{{t.Last.trip.nextReverse ? 'R' : '-'}}</td>

        <td v-if="!t.Last || !t.Last.trip.nextTrip"></td>
        <td v-if="t.Last && t.Last.trip.nextTrip" class="red box" @click="detach(t.Last.trip.id)">detach</td>

        <td v-if="!t.First" colspan="5"></td>
        <td v-if="t.First" class="blue box" @click="paste(t.First.trip.id)">{{t.First.trip.prevTrip}}</td>  
        <td v-if="t.First">{{t.First.timeStr}}</td>
        <td v-if="t.First">{{t.First.trip.route.name}}</td> 
        <td v-if="t.First">{{t.First.trip.route.detailedName}}</td>
        <td v-if="t.First">{{t.First.trip.id}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TYPES } from "../../di/TYPES";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";
import { TripEnd } from "../../structs/Scheduling/TripEnd";
import { TripWithEnd } from "../../structs/Scheduling/TripWithEnd";
import {
  getStorable,
  getAllOfStorable,
  createStorable,
} from "../../structs/Actuals/Store/StoreForVue";
import {
  copyTripId,
  pasteTripId
} from "../../structs/Actuals/Store/TripIdClipboard";

@Component
export default class TripConnector extends Vue {
  lastRoutes: string[] = ['WNxyhJVS6'];
  firstRoutes: string[] = ['1XihqJwLy'];
  tripList: any[] = [];

  get tripsWithEnd(): Record<TripEnd, TripWithEnd>[] {
    const lasts = this.tripList.filter(t => this.lastRoutes.includes(t.route.id));
    const firsts = this.tripList.filter(t => this.firstRoutes.includes(t.route.id));
    const all = [];
    all.push(...lasts.map(t => ({end: TripEnd.Last, trip: t, time: t.arrivalTime, timeStr: t.arrivalTimeString})));
    all.push(...firsts.map(t => ({end: TripEnd.First, trip: t, time: t.departureTime, timeStr: t.departureTimeString})));
    all.sort((a, b) => {
      if(a.time === b.time) return a.end < b.end ? -1 : 1;
      return a.time-b.time;
    });
    const dual: Record<TripEnd | 'key', TripWithEnd>[] = [];
    for(let i=0;i<all.length;i++) {
      if(all[i].end === TripEnd.Last) {
        if(all[i+1] && all[i+1].end === TripEnd.First 
          && all[i].trip.nextTrip === all[i+1].trip.id
          && all[i].trip.id === all[i+1].trip.prevTrip
        ) {
          dual.push({Last: all[i], First: all[i+1], key: all[i].id});
          i++;
        } else {
          dual.push({Last: all[i], First: null, key: all[i].id});
        }
      } else {
        dual.push({Last: null, First: all[i], key: all[i].id});
      }
    }

    return dual;
  }

  update(): void {
    this.tripList = getAllOfStorable(TYPES.Trip).map((x) =>
      Object.freeze(x.persistDeep())
    );
  }

  constructor() {
    super();
    setTimeout(() => this.update(), 0);
  }

  copy(tripId: string): void {
      copyTripId(tripId);
  }

  paste(tripId: string): void {
      const paste = pasteTripId();

      const prevTrip = getStorable(paste) as Trip;
      const nextTrip = getStorable(tripId) as Trip;

      prevTrip?.setNextTrip(nextTrip);
      nextTrip?.setPrevTrip(prevTrip);

      this.update();
  }

  detach(lastId: string): void {
      const prevTrip = getStorable(lastId) as Trip;
      const nextTrip = prevTrip?.getNextTrip();

      prevTrip?.setNextTrip(null);
      nextTrip?.setPrevTrip(null);

      this.update();
  }

  toggleReverse(lastId: string): void {
      const trip = getStorable(lastId) as Trip;
      trip?.toggleNextReverse();

      this.update();
  }
}
</script>

<style scoped>
.trip-list {
  display: flex;
  margin-top: 14px;
  overflow-x: scroll;
}

.trip {
  display: flex;
  flex-direction: column;
  margin: 0 5px;
}

.trip-stop {
  display: flex;
  margin-bottom: 10px;
}

.trip-stop-time,
.trip-stop-time-header {
  border-radius: 2px;
  border: 1px solid #070;
  padding: 0 3px 0 3px;
  width: 35px;
  text-align: right;
  font: 400 13.3333px Arial;
  height: 13px;
}

.trip-stop-time-header {
  background-color: #070;
  border: 1px solid #cec;
  color: #cec;
  text-align: center;
}

.trip-id-header {
  border-radius: 2px;
  padding: 0 3px 0 3px;
  width: 78px;
  font: 400 13.3333px Arial;
  height: 13px;

  background-color: #070;
  border: 1px solid #cec;
  color: #cec;
  text-align: center;
}

.box {
  border-radius: 2px;
  padding: 0 3px 0 3px;
  width: 78px;
  font: 400 13.3333px Arial;
  height: 13px;

  background-color: #070;
  border: 1px solid #cec;
  color: #cec;
  text-align: center;
}

.blue {
  background-color: #007;
  border: 1px solid #cce;  
}

.blue:hover {
  background-color: #00A;
  cursor: pointer;
}

.red {
  background-color: #f00;
  color: #fff;
  border: 1px solid #cce;  
}

.red:hover {
  background-color: #f00;
  color: #fff;
  cursor: pointer;
}

.trip-id-divider {
  display: flex;
      justify-content: space-between;
    padding: 0;
    width: 84px;
}

.trip-id {
  width: 40px;
  padding: 0 3px 0 3px;
}

.trip-repeat-adder {
    width: 13px;
    background-color: #aaccaa;
    color: #1a7700;
    cursor: pointer;
}
</style>
