<template>
  <div class="stop">
    <div class="stop-circle" :style="{backgroundColor: stop.rgbColor}"></div>
    <div v-if="index !== route.stops.length-1" class="stop-after color"></div>
    <div v-if="index === route.stops.length-1" class="stop-after nocolor"></div>
    <div class="stop-name">{{stop.stationName}}</div>
    
    <!-- buttons -->
    <div class="stop-button-holder">
      <div v-if="canmove" class="stop-button stop-move" @click.stop="$emit('move')">▲</div>
      <div v-if="candelete" class="stop-button stop-delete" @click.stop="$emit('delete')">x</div>
    </div>

    <!-- platform -->
    <select v-if="!isTrip" size="1" class="stop-select-platform">
      <option value="1">?</option>
    </select>

    <!-- arrival departure -->
    <input v-if="!isTrip" class="stop-input-time" type="text" v-model="stop.arrivalTimeString" 
      @keyup.stop="handleTime('arrivalTime', $event)" />
    <input v-if="!isTrip" class="stop-input-time" type="text" v-model="stop.departureTimeString"
      @keyup.stop="handleTime('departureTime', $event)" />

    <div v-if="isTrip" class="trip-stop-time">{{stop.arrivalTimeString}}</div>
    <div v-if="isTrip" class="trip-stop-time">{{stop.departureTimeString}}</div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Store } from "../../structs/Interfaces/Store";
import { productionContainer } from "../../di/production.config";
import { TYPES } from "../../di/TYPES";
import { RouteStop } from "../../structs/Scheduling/RouteStop";

@Component
export default class RouteTitle extends Vue {
  @Prop() stop: any;
  @Prop() route: any;
  @Prop() index: number;
  @Prop() candelete?: boolean;
  @Prop() canmove?: boolean;
  @Prop() isTrip?: boolean;

  private store:Store;

  constructor() {
    super();
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
  }

  handleTime(column: string, event:any): void {
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
      event.currentTarget.value = value;

      const stop = this.store.get(this.stop.id) as RouteStop;
      if(column === 'arrivalTime') {
        stop.setArrivalTime(value === '' ? undefined : time * 60);
      }
      if(column === 'departureTime') {
        stop.setDepartureTime(value === '' ? undefined : time * 60);
      }

  }
}
</script>

<style scoped>
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

.trip-stop-time {
  border-radius: 2px;
  border: 1px solid #070;
  padding: 0 3px 0 3px;
  width: 35px;
  text-align: right;
  font: 400 13.3333px Arial;
  height: 13px;
}

</style>
