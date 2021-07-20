<template>
  <div>
    <div>
      Trip Connector
    </div>
    <div class="xyz" :key="t.trip.id" v-for="t in tripsWithEnd">
      {{t.trip.id}} - {{t.end}} - {{t.timeStr}} - {{t.trip.route.name}}
    </div>
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

  get tripsWithEnd(): TripWithEnd[] {
    const lasts = this.tripList.filter(t => this.lastRoutes.includes(t.route.id));
    const firsts = this.tripList.filter(t => this.firstRoutes.includes(t.route.id));
    const all = [];
    all.push(...lasts.map(t => ({end: TripEnd.Last, trip: t, time: t.arrivalTime, timeStr: t.arrivalTimeString})));
    all.push(...firsts.map(t => ({end: TripEnd.First, trip: t, time: t.departureTime, timeStr: t.departureTimeString})));
    all.sort((a, b) => {
      if(a.time === b.time) return a.end < b.end ? -1 : 1;
      return a.time-b.time;
    });
    return all;
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

.blue {
  background-color: #007;
  border: 1px solid #cce;  
}

.blue:hover {
  background-color: #00A;
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
