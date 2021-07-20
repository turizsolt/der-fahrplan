<template>
  <div>
    <div>
      Time:
      <input
        style="width: 80px"
        @keyup.stop="handleTime"
        type="text"
        v-model="timeStr"
      />
      <button style="width: 80px" @click="addTrip">Add&nbsp;trip</button>
      <button style="width: 80px" @click="update">Update list</button>
      Headway:
      <input
        style="width: 80px"
        @keyup.stop="handleHeadway"
        type="text"
        v-model="headwayStr"
      />
    </div>
    <div>
      <div class="trip-list">
        <div class="trip" :key="trip.id" v-for="trip in filteredTripList">
          <div class="trip-stop trip-id-header blue" @click="paste(trip.id)">
              {{trip.prevTrip}}
          </div>
          <div class="trip-stop trip-id-header trip-id-divider">
              <div class="trip-id">{{trip.id}}</div>
              <div class="trip-repeat-adder" @click="addRepeatedTrips(trip.id, trip.nextId)">+</div>
          </div>
          <div class="trip-stop">
            <div class="trip-stop-time-header trip-stop-arrival">arr</div>
            <div class="trip-stop-time-header trip-stop-departure">dep</div>
          </div>
          <div class="trip-stop" :key="stop.id" v-for="stop in trip.stops">
            <div class="trip-stop-time trip-stop-arrival">
              {{ stop.isDepartureStation ? "-" : stop.arrivalTimeString }}
            </div>
            <div class="trip-stop-time trip-stop-departure">
              {{ stop.isArrivalStation ? "-" : stop.departureTimeString }}
            </div>
          </div>
          <div class="trip-stop trip-id-header blue" @click="copy(trip.id)">
              {{trip.nextTrip}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TYPES } from "../../di/TYPES";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";
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
export default class AddTrip extends Vue {
  @Prop() route: any;
  timeStr: string = "";
  time: number = 0;
  headwayStr: string = "";
  headway: number = 0;
  tripList: any[] = [];
  get filteredTripList() {
    const list = this.tripList.filter((t) => t.routeId === this.route.id).sort((a, b) => a.departureTime - b.departureTime);
    for(let i=1;i<list.length;i++) {
      list[i-1] = {...list[i-1], nextId: list[i].id};
    }
    return list;
  }

  constructor() {
    super();
    setTimeout(() => this.update(), 0);
  }

  update(): void {
    this.tripList = getAllOfStorable(TYPES.Trip).map((x) =>
      Object.freeze(x.persistDeep())
    );
  }

  addTrip(): void {
    const route = getStorable(this.route.id) as Route;
    const trip = createStorable<Trip>(TYPES.Trip).init(route, this.time);
    this.timeStr = "";
    this.update();
  }

  addRepeatedTrips(tripId: string, tripId2: string): void {
    if(this.headway < 1) return;
    if(!tripId2) return;

    const trip = getStorable(tripId) as Trip;
    const trip2 = getStorable(tripId2) as Trip;
    let next = trip.getDepartureTime();
    const till = trip2.getDepartureTime();
    for(let i=next+this.headway;i<till;i+=this.headway) {
      const route = getStorable(this.route.id) as Route;
      const newTrip = createStorable<Trip>(TYPES.Trip).init(route, i);
    }
    this.update();
  }

  handleTime(event: any): void {
    let value = event.currentTarget.value;
    value = value
      .split("")
      .filter((x) => "0" <= x && x <= "9")
      .join("");
    if (value.length > 4) {
      value = value.substr(0, 4);
    }
    let time = parseInt(value, 10);
    if (value.length > 2) {
      value = value.substr(0, value.length - 2) + ":" + value.substr(-2);
      time =
        parseInt(value.substr(0, value.length - 2), 10) * 60 +
        parseInt(value.substr(-2), 10);
    }
    this.timeStr = value;
    this.time = value === "" ? undefined : time * 60;
  }

  handleHeadway(event: any): void {
    let value = event.currentTarget.value;
    value = value
      .split("")
      .filter((x) => "0" <= x && x <= "9")
      .join("");
    if (value.length > 4) {
      value = value.substr(0, 4);
    }
    let time = parseInt(value, 10);
    if (value.length > 2) {
      value = value.substr(0, value.length - 2) + ":" + value.substr(-2);
      time =
        parseInt(value.substr(0, value.length - 2), 10) * 60 +
        parseInt(value.substr(-2), 10);
    }
    this.headwayStr = value;
    this.headway = value === "" ? undefined : time * 60;
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
