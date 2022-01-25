<template>
  <div id="sg-container">
    <select v-model="selectedRouteId" @change="handleRouteChange">
      <option value="">Select a route</option>
      <option v-for="route in routes" :key="route.id" :value="route.id">
        {{ route.name }}
        {{ route.detailedName }}
      </option>
    </select>
    <div
      id="sg-schedule-grid"
      :style="'grid-template-rows: repeat(' + rowCount + ', 10px);'"
    >
      <div class="header0" style="grid-column: span 3; grid-row: span 8">
        Header
      </div>
      <div class="header0 half" v-if="rowCount > 0"></div>
      <div
        class="header0 cell right time-cell"
        v-for="(time, index) in times"
        :key="index"
      >
        <div class="time">
          {{ time.extraTime }}
        </div>
        <div class="plus-minus">
          <div @click="handleExtraTimePlus(time.stopId)">+</div>
          <div @click="handleExtraTimeMinus(time.stopId)">-</div>
        </div>
      </div>
      <div class="header0 half" v-if="rowCount > 0"></div>
      <div class="header0" style="grid-column: span 3; grid-row: span 4">
        Footer
      </div>

      <div class="header1 half" v-if="rowCount > 0"></div>
      <div
        class="header1 cell right time-cell"
        v-for="(time, index) in times"
        :key="index"
      >
        <div class="time">
          {{ time.time }}
        </div>
        <div class="plus-minus">
          <div @click="handleTimePlus(time.stopId)">+</div>
          <div @click="handleTimeMinus(time.stopId)">-</div>
        </div>
      </div>
      <div class="header1 half" v-if="rowCount > 0"></div>

      <div
        class="left header2"
        :class="stop.size === 2 ? 'cell-double' : 'cell'"
        v-for="(stop, index) in stops"
        :key="index"
      >
        {{ stop.name }}
      </div>

      <template v-for="(time, index) in timetable">
        <div v-if="time.inter" class="column center" :key="index">
          Headway
          <input
            id="sg-inter-headway"
            style="width: 100%"
            @keyup.stop="handleInterHeadway(time.inter.prevTime, $event)"
            type="text"
          />
          Add new
          <input
            id="sg-inter-time"
            style="width: 100%"
            @keyup.stop="handleInterTime(time.inter.prevTime, $event)"
            type="text"
          />
        </div>
        <div v-else-if="time.adder" class="column center" :key="index">
          Headway
          <input
            id="sg-adder-headway"
            style="width: 100%"
            @keyup.stop="
              handleAdderHeadway(
                time.adder.prevTime,
                time.adder.nextTime,
                $event
              )
            "
            type="text"
          />
          Add new
          <input
            id="sg-adder-time"
            style="width: 100%"
            @keyup.stop="handleAdderTime"
            type="text"
          />
        </div>
        <div
          v-else-if="time.actions"
          class="cell center"
          style="display: flex"
          :key="index"
        >
          <div
            class="adder-insert"
            @click="handleShowAdder(time.actions.tripId)"
          >
            ⤵
          </div>
          <input class="select-trip" type="checkbox" />
          <!--ⓧ-->
        </div>
        <div v-else-if="time.sign" class="cell center" :key="index">
          <route-sign :name="time.sign.name" :color="time.sign.color" />
        </div>
        <div v-else-if="time.prev" class="cell-double center" :key="index">
          <template v-if="time.hasPrev">
            <route-sign :name="time.prev.name" :color="time.prev.color" />
            <div class="prev-time">{{ time.prev.timeStr }}</div>
            <div class="prev-arrow">▼</div>
          </template>
          <template v-else> ? </template>
        </div>
        <div v-else-if="time.next" class="cell-double center" :key="index">
          <template v-if="time.hasNext">
            <div class="next-arrow">▼</div>
            <div class="next-time">{{ time.next.timeStr }}</div>
            <route-sign :name="time.next.name" :color="time.next.color" />
          </template>
          <template v-else> ? </template>
        </div>
        <div v-else class="cell right" :key="index">{{ time.timeStr }}</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { RouteVariant } from "../../structs/Scheduling/RouteVariant";
import { Trip } from "../../structs/Scheduling/Trip";
import { TYPES } from "../../di/TYPES";
import {
  getAllOfStorable,
  getStorable,
  createStorable,
} from "../../structs/Actuals/Store/StoreForVue";
import { ScheduleGridComputer } from "./ScheduleGridComputer";
import { handleTimeText } from "./HandleTime";

@Component
export default class ScheduleGrid extends Vue {
  routes: any[] = [];
  selectedRouteId: string = "";
  selectedRoute: any = null;

  stops: any[] = [];
  times: any[] = [];
  timetable: any[] = [];
  rowCount: number = 0;

  adder: string = null;

  created() {
    this.load();
  }

  reset() {
    this.stops = [];
    this.times = [];
    this.timetable = [];
    this.rowCount = 0;
  }

  handleRouteChange(event: any): void {
    this.selectedRouteId = event.currentTarget.value;
    this.update();
  }

  load() {
    this.routes = getAllOfStorable<RouteVariant>(TYPES.RouteVariant).map((x) =>
      x.persistDeep()
    );
    this.update();
  }

  update() {
    if (this.selectedRouteId) {
      const route = getStorable(this.selectedRouteId) as RouteVariant;
      this.selectedRoute = route.persistDeep();

      if (route) {
        const { stops, times, rowCount, timetable } =
          ScheduleGridComputer.getByRoute(route, this.adder);
        this.stops = stops;
        this.times = times;
        this.rowCount = rowCount;
        this.timetable = timetable;
      } else {
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  setFocus(gridId: string, focusId: string): void {
    setTimeout(() => {
      if (gridId) {
        const sg = document.getElementById(gridId);
        sg.scrollTo({ top: 0, left: sg.scrollWidth, behavior: "smooth" });
      }
      const target = document.getElementById(focusId);
      target.focus();
    }, 0);
  }

  createTrip(time: number): void {
    const route = getStorable(this.selectedRouteId) as RouteVariant;
    const trip = createStorable<Trip>(TYPES.Trip).init(route, time);
  }

  createTrips(timeFrom: number, timeTo: number, headway: number): void {
    const route = getStorable(this.selectedRouteId) as RouteVariant;
    for (let i = timeFrom + headway; i < timeTo; i += headway) {
      const trip = createStorable<Trip>(TYPES.Trip).init(route, i);
    }
  }

  handleInterTime(prevTime: number, event: any): void {
    const { time, timeStr } = handleTimeText(event);

    if (event.keyCode === 13) {
      const headwayStr = (
        document.getElementById("sg-inter-headway") as HTMLInputElement
      ).value;
      const headway = handleTimeText({
        currentTarget: { value: headwayStr },
      }).time;

      this.createTrips(prevTime, time, headway);
      this.createTrip(time);
      event.currentTarget.value = "";
      this.update();

      this.setFocus("sg-schedule-grid", "sg-inter-time");
    } else {
      event.currentTarget.value = timeStr;
    }
  }

  handleInterHeadway(prevTime: number, event: any): void {
    const { time, timeStr } = handleTimeText(event);

    if (event.keyCode === 13) {
      const tStr = (
        document.getElementById("sg-inter-time") as HTMLInputElement
      ).value;
      if (tStr) {
        const t = handleTimeText({ currentTarget: { value: tStr } }).time;

        this.createTrips(prevTime, t, time);
        this.createTrip(t);
        event.currentTarget.value = "";
        this.update();

        this.setFocus("sg-schedule-grid", "sg-inter-time");
      } else {
        event.currentTarget.value = timeStr;
      }
    } else {
      event.currentTarget.value = timeStr;
    }
  }

  handleAdderTime(event: any): void {
    const { time, timeStr } = handleTimeText(event);

    if (event.keyCode === 13) {
      this.createTrip(time);
      event.currentTarget.value = "";

      this.adder = null;
      this.update();
    } else {
      event.currentTarget.value = timeStr;
    }
  }

  handleAdderHeadway(prevTime: number, nextTime: number, event: any): void {
    const { time, timeStr } = handleTimeText(event);

    if (event.keyCode === 13) {
      this.createTrips(prevTime, nextTime, time);

      this.adder = null;
      this.update();
    } else {
      event.currentTarget.value = timeStr;
    }
  }

  handleTimeMinus(stopId: string): void {
    console.log("t-", stopId);
  }

  handleTimePlus(stopId: string): void {
    console.log("t+", stopId);
  }

  handleExtraTimeMinus(stopId: string): void {
    /*const stop = getStorable(stopId) as RouteStop;
    stop.setExtraTimeToStation(stop.getExtraTimeToStation() - 30);
    this.update();*/
  }

  handleExtraTimePlus(stopId: string): void {
    /*const stop = getStorable(stopId) as RouteStop;
    stop.setExtraTimeToStation(stop.getExtraTimeToStation() + 30);
    this.update();*/
  }

  handleShowAdder(tripId: string): void {
    if (tripId === this.adder) {
      this.adder = null;
    } else {
      this.adder = tripId;
    }
    this.update();
  }
}
</script>

<style>
#sg-container {
  width: 100%;
}

#sg-schedule-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 40px 40px 100px;
  grid-auto-columns: 60px;
  overflow: scroll hidden;
}

#sg-schedule-grid > div {
  align-items: center;
  display: grid;
  height: 100%;
}

.time-cell {
  grid-template-columns: 30px 10px;
  grid-template-rows: 100%;
}

.time {
  width: 40px;
}

.plus-minus {
  position: relative;
  top: 0px;
  left: -30px;
  width: 40px;
  display: flex;
}

.plus-minus div {
  width: 20px;
  text-align: center;
  opacity: 0.3;
}

.plus-minus div:hover {
  background-color: #aca;
  opacity: 0.8;
  cursor: pointer;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}

.center {
  text-align: center;
}

.cell {
  grid-row: span 2;
}

.cell-double {
  grid-row: span 4;
}

.column {
  grid-row: 1/-1;
}

.header0,
.header1,
.header2 {
  position: sticky;
  background-color: #cec;
}

.header0 {
  left: 0px;
}

.header1 {
  left: 40px;
}

.header2 {
  left: 80px;
}

.prev-time,
.next-time {
  text-align: right;
}

.prev-arrow,
.next-arrow {
  font-size: 8px;
  text-align: right;
  padding-right: 1.8em;
}

.prev-arrow {
  margin-top: -4px;
}

.next-arrow {
  margin-bottom: -4px;
}

.select-trip {
  margin-left: 22px;
}

.adder-insert:hover {
  cursor: pointer;
}
</style>
