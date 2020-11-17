<template>
  <div>
    Time:
    <br />
    <input style="width: 80px;" @keyup.stop="handleTime" type="text" v-model="timeStr" />
    <br />
    <button style="width: 80px;" @click="addTrip">Add&nbsp;trip</button>
    <hr />
    <button style="width: 80px;" @click="update">Update list</button>
    <div>Trip departure times:</div>
    <div :key="trip.id" v-for="trip in filteredTripList">{{trip.departureTimeString}}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Store } from "../../structs/Interfaces/Store";
import { productionContainer } from "../../di/production.config";
import { TYPES } from "../../di/TYPES";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";

@Component
export default class RouteTitle extends Vue {
  @Prop() route: any;
  timeStr: string = '';
  time: number = 0;
  tripList: any[] = [];
  get filteredTripList() {
    return this.tripList.filter(t => t.routeId === this.route.id);
  }
  
  private store:Store;

  constructor() {
    super();
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
    setTimeout(() => this.update(), 0);
  }

  update(): void {
      this.tripList = this.store.getAllOf(TYPES.Trip)
        .map(x => x.persistDeep());
  }

  addTrip(): void {
    const route = this.store.get(this.route.id) as Route;
    const trip = this.store.create<Trip>(TYPES.Trip).init(route, this.time);
    this.timeStr = '';
    this.update();
  }

  handleTime(event:any): void {
      let value = event.currentTarget.value;
      value = value.split('').filter(x => '0' <= x && x <= '9').join('');
      if(value.length > 4) {
          value = value.substr(0,4);
      }
      let time = parseInt(value, 10);
      if(value.length > 2) {
          value = value.substr(0, value.length-2)+":"+value.substr(-2);
          time = parseInt(value.substr(0, value.length-2), 10)*60 + 
            parseInt(value.substr(-2), 10);
      }
      //event.currentTarget.value = value;
      this.timeStr = value;
      this.time = value === '' ? undefined : time * 60;

  }
}
</script>

<style>
.stop:hover {
    background-color: #aaccaa;
}

.stop-button-holder {
    flex-grow: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
}

.stop-button {
    border-radius: 50%;
    background-color: #1a7829;
    color: #aaccaa;
    width: 16px;
    height: 16px;
    line-height: 14px;
    text-align: center;
    margin: -1px 1px 1px 1px;
}

.stop-button:hover {
    border-radius: 50%;
    background-color: #aaccaa;
    color: #1a7829;
    cursor: pointer;
}

.stop-input-time {
    border-radius: 2px;
    border: 1px solid #070;
    padding: 0 3px 0 3px;
    width: 35px;
    text-align: right;
}

.stop-select-platform {
    border-radius: 2px;
    border: 1px solid #070;
    padding: 0 3px 0 3px;
    width: 50px;
    font-size: 10px;
}

</style>
