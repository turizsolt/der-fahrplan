<template>
  <div id="map-field">
    <div v-for="stop in sideStops" :key="stop.id" class="side-stop" :title="stop.name" :style="stop.style"></div>
    <div v-for="time in sideTimes" :key="time.id" class="side-time" :title="time.name" :style="time.style"></div>
    <div v-for="stop in stops" :key="stop.id" class="stop-plot" :title="stop.name" :style="stop.style"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TYPES } from "../../di/TYPES";
import { Trip } from "../../structs/Scheduling/Trip";
import { Route } from "../../structs/Scheduling/Route";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { Station } from "../../structs/Scheduling/Station";
import { getStore, getStorable } from "../../structs/Actuals/Store/StoreForVue";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapNode } from "../../modules/RailMap/RailMapNode";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";

@Component
export default class RouteDiagram extends Vue {
  private map: RailMap;
  @Prop() route: any;
  sideStops: any = [];
  sideTimes: any = [];
  stops: any = [];
  minTime: number = 0;
  maxTime: number = 60*60*24;

  constructor() {
    super();
    
    this.init = this.init.bind(this);

    setTimeout(() => {
      this.init();
    }, 0);
  }

  @Watch('route') 
  init() {
      this.map = RailMapCreator.create(getStore());
      const route = getStorable(this.route && this.route.id) as Route;

      const mapField = document.getElementById('map-field');
      const h = mapField.clientHeight - 40;
      const w = mapField.clientWidth - 40;

      this.sideStops = [];
      if(route) {
        let position:number = 0;
        let prevStop:RouteStop = null;
        let maxHeight:number = 0;
        let pos: number = 0;

        for(let stop of route.getWaypoints()) {
          if(prevStop) {
            maxHeight += this.map.getDistance(prevStop.getWaypoint(), stop.getWaypoint());
          }
          prevStop = stop;
        }

        const stopHeights: Record<string, number> = {};
        
        prevStop = null;
        for(let stop of route.getWaypoints()) {
          if(prevStop) {
            position = this.map.getDistance(prevStop.getWaypoint(), stop.getWaypoint());
          }
          pos += position;
          this.sideStops.push({
              id: stop.getWaypoint().getId(),
              position,
              name: stop.getWaypoint().getName(),
              style: {
                  left: (20-2)+'px',
                  top: (20-2+pos/maxHeight*h)+'px',
                  width: '4px',
                  height: '4px'
              }
          });
          stopHeights[stop.getWaypoint().getId()] = pos/maxHeight*h;
          prevStop = stop;
        }

        const tripId = 'Zv2t0vIQc';
        this.stops = [];
        const trip = getStorable(tripId) as Trip;
        for(let stop of trip.getWaypoints()) {
          this.stops.push({
            id: stop.station.getId()+'-'+stop.arrivalTime,
            name: stop.arrivalTime+' '+stop.station.getName(),
            style: {
              left: (20-2+stop.arrivalTime/(this.maxTime-this.minTime)*w)+'px',
              top: (20-2+stopHeights[stop.station.getId()])+'px',
              width: '4px',
              height: '4px'
            }
          });
        }
      }


      this.sideTimes = [];
      const t = Math.ceil(this.minTime/(60*30))*60*30;
      const tend = Math.floor(this.maxTime/(60*30))*60*30;
      for(let i=t;i<=tend;i+=60*30) {
        this.sideTimes.push({
          id: i,
          name: i, // todo Util
          style: {
            left: (20-2+i/(this.maxTime-this.minTime)*w)+'px',
            top: (20+h)+'px',
            width: '4px',
            height: '4px'
          }
        });
      }
  }

  update() {}
}
</script>

<style scoped>
#map-field {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid red;
}

.stop-plot {
  border-radius: 50%;
  border: 1px solid darkblue;
  background-color: blue;
  position: absolute;
}

.side-stop {
  border-radius: 50%;
  border: 1px solid orange;
  background-color: yellow;
  position: absolute;
}


.side-time {
  border-radius: 50%;
  border: 1px solid black;
  background-color: darkgray;
  position: absolute;
}

</style>
