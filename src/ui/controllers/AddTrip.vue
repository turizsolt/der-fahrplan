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
        <div :class="trip.type === 'Trip' ? 'trip' : 'trip-as-group'" :key="trip.id" v-for="trip in filteredTripList">
          <div v-if="trip.type === 'Trip'">
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
            <div class="trip-stop" :key="stop.id" v-for="stop in trip.waypoints">
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
          <div v-if="trip.type === 'TripGroup'" class="trip-group">
            <div v-if="closedGroups[trip.id]" class="trip-group-headway">
              <b>{{(Math.floor(trip.headway/60))}}</b>{{fraction(trip.headway%60)}}<br />
              mins<br /><br />
              <span class="expand" @click="expandGroup(trip.id)">[expand]</span>
            </div>
            <div class="trip" v-else :key="trip2.id" v-for="trip2 in trip.trips">
              <div class="trip-stop trip-id-header blue" @click="paste(trip2.id)">
                  {{trip2.prevTrip}}
              </div>
              <div class="trip-stop trip-id-header trip-id-divider">
                  <div class="trip-id">{{trip2.id}}</div>
                  <div class="trip-repeat-adder" @click="collapseGroup(trip.id)">-</div>
              </div>
              <div class="trip-stop">
                <div class="trip-stop-time-header trip-stop-arrival">arr</div>
                <div class="trip-stop-time-header trip-stop-departure">dep</div>
              </div>
              <div class="trip-stop" :key="stop.id" v-for="stop in trip2.waypoints">
                <div class="trip-stop-time trip-stop-arrival">
                  {{ stop.isDepartureStation ? "-" : stop.arrivalTimeString }}
                </div>
                <div class="trip-stop-time trip-stop-departure">
                  {{ stop.isArrivalStation ? "-" : stop.departureTimeString }}
                </div>
              </div>
              <div class="trip-stop trip-id-header blue" @click="copy(trip2.id)">
                  {{trip2.nextTrip}}
              </div>
            </div>
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
import { TripGroup } from "../../structs/Scheduling/TripGroup";
import {
  getStorable,
  getAllOfStorable,
  createStorable,
} from "../../structs/Actuals/Store/StoreForVue";
import {
  copyTripId,
  pasteTripId
} from "../../structs/Actuals/Store/TripIdClipboard";
import { handleTimeText } from "./HandleTime";

@Component
export default class AddTrip extends Vue {
  @Prop() route: any;
  timeStr: string = "";
  time: number = 0;
  headwayStr: string = "";
  headway: number = 0;
  tripList: any[] = [];
  tripGroupList: any[] = [];
  closedGroups: Record<string, boolean> = null;

  get filteredTripList() {
    const list = this.tripList.filter((t) => t.routeId === this.route.id && !t.hasGroup);
    list.push(...this.tripGroupList.filter((t) => t.trips[0] && t.trips[0].routeId === this.route.id));
    list.sort((a, b) => a.departureTime - b.departureTime);
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
    this.tripGroupList = getAllOfStorable(TYPES.TripGroup).map((x) =>
      Object.freeze(x.persistDeep())
    );

    if(!this.closedGroups) {
      this.closedGroups = {};
    }
    
    for(let group of this.tripGroupList) {
      if(this.closedGroups[group.id] === undefined) {
        this.closedGroups[group.id] = true;
      }
    }
  }

  expandGroup(id:string): void {
    this.closedGroups[id] = false;
    this.update();
  }

  collapseGroup(id:string): void {
    this.closedGroups[id] = true;
    this.update();
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
    if(trip2.getType() !== TYPES.Trip) return;

    if(trip.getHasGroup()) return;
    if(trip2.getHasGroup()) return;

    let next = trip.getDepartureTime();
    const till = trip2.getDepartureTime();
    const trips:Trip[] = [];
    for(let i=next+this.headway;i<till;i+=this.headway) {
      const route = getStorable(this.route.id) as Route;
      const newTrip = createStorable<Trip>(TYPES.Trip).init(route, i, true);
      trips.push(newTrip);
    }
    createStorable<TripGroup>(TYPES.TripGroup).init(this.headway, trips);
    this.update();
  }

  handleTime(event: any): void {
    const {time, timeStr} = handleTimeText(event);
    this.timeStr = timeStr;
    this.time = time;
  }

  handleHeadway(event: any): void {
    const {time, timeStr} = handleTimeText(event);
    this.headwayStr = timeStr;
    this.headway = time;
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

  gcd(a, b) {
    if (!b) {
      return a;
    }

    return this.gcd(b, a % b);
  }

  fraction(x:number) {
      if(x === 0) return '';
      const gcd = this.gcd(x, 60);
      return ' '+(x/gcd)+'/'+(60/gcd);
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

.trip-as-group {
  display: flex;
  margin: 0;
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

.trip-group {
  display: flex;
  background-color: #aaccaa;
  align-self: center;
  height: calc(100% - 10px);
  margin-bottom: 10px;
}

.trip-group-headway {
  align-self: center;
  text-align: center;
  width: 97px;
}

.expand:hover {
  cursor: pointer;
}

</style>
