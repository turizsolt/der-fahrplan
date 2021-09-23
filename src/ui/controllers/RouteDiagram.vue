<template>
  <div style="width:100%;">
    <div>
      <button @click="move(0, -1)">This-</button>
      <button @click="move(0, +1)">This+</button>
      <button @click="move(1, -1)">Before-</button>
      <button @click="move(1, +1)">Before+</button>
      <button @click="move(2, -1)">After-</button>
      <button @click="move(2, +1)">After+</button>
      <button @click="move(3, -1)">All-</button>
      <button @click="move(3, +1)">All+</button>
      ****
      <button @click="move(4, -1)">Arr-</button>
      <button @click="move(4, +1)">Arr+</button>
      <button @click="move(5, -1)">Dep-</button>
      <button @click="move(5, +1)">Dep+</button>
      time
      <button @click="time(0, -1)">Start-</button>
      <button @click="time(0, +1)">Start+</button>
      <button @click="time(1, -1)">End-</button>
      <button @click="time(1, +1)">End+</button>
      {{minTimeStr}}
      {{maxTimeStr}}
    </div>
    <div id="map-field">
      <div v-for="line in sideLines" :key="line.id" class="side-line" :style="line.style"></div>  
      <div v-for="line in stopLines" :key="line.id" class="stop-line" :style="line.style"></div>  
    
      <div v-for="stop in sideStops" :key="stop.id" class="side-stop" :title="stop.name" :style="stop.style"></div>
      <div v-for="time in sideTimes" :key="time.id" class="side-time" :title="time.name" :style="time.style"></div>
      <div v-for="stop in stops" :key="stop.uniqueId" class="stop-plot" :class="selectedStop && stop.id === selectedStop.id ? 'selected-stop' : ''" :title="stop.name" :style="stop.style" @click.stop="select(stop)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TYPES } from "../../di/TYPES";
import { Trip } from "../../structs/Scheduling/Trip";
import { TripStop } from "../../structs/Scheduling/TripStop";
import { Route } from "../../structs/Scheduling/Route";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { Station } from "../../modules/Station/Station";
import { getStore, getStorable, getAllOfStorable } from "../../structs/Actuals/Store/StoreForVue";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapNode } from "../../modules/RailMap/RailMapNode";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";
import { RailDiagram } from "../../modules/RailDiagram/RailDiagram";
import { Util } from "../../structs/Util";

@Component
export default class RouteDiagram extends Vue {
  private diagram: RailDiagram;
  @Prop() route: any = null;
  sideStops: any[] = [];
  sideTimes: any[] = [];
  stops: any[] = [];
  sideLines: any[] = [];
  stopLines: any[] = [];
  minTime: number = 0;
  maxTime: number = 60*60*24;
  minTimeStr: string = '0:00';
  maxTimeStr: string = '24:00';
  selectedStop: any = null;

  constructor() {
    super();
    
    this.init = this.init.bind(this);
    this.diagram = new RailDiagram(getStore());

    setTimeout(() => {
      this.init();
    }, 0);
  }

  @Watch('route') 
  init() {
    const route = getStorable(this.route && this.route.id) as Route;
    this.diagram.setRoute(route);

    const mapField = document.getElementById('map-field');
    const h = mapField.clientHeight - 40;
    const w = mapField.clientWidth - 40;

    const plotToStyle = (plot) => ({
      left: (20-2+plot.t*w)+'px',
      top: (20-2+plot.r*h)+'px',
      width: '4px',
      height: '4px'
    });

    this.sideStops = [];
    this.stops = [];
    if(route) {
      const {plots, lines} = this.diagram.getRouteAxis();
      this.sideStops = plots.map(plot => ({
        ...plot,
        style: plotToStyle(plot)
      }));

      this.sideLines = lines.map(line => {
        const len = Math.abs(line.from.r-line.to.r)*h;
        const rotate = 0;
        return {
          ...line,
          style: {
            left: (20-2+Math.min(line.from.t,line.to.t)*w)+'px',
            top: (20-2+Math.min(line.from.r,line.to.r)*h)+'px',
            height: len+'px',
            width: (line.trackCount*3)+'px',
            transform: 'rotate('+(-rotate)+'rad)'
          }
        };
      });
       
      const {plots: plots2, lines: lines2} = this.diagram.getPlotsAndLines();
      this.stops = plots2.map(plot => ({
        ...plot,
        style: plotToStyle(plot)
      }));

      this.stopLines = lines2.map(line => {
        const len = Math.sqrt(
          Math.pow((line.from.r-line.to.r)*h, 2) +
          Math.pow((line.from.t-line.to.t)*w, 2)
        );
        const rotate = Math.atan2((line.to.t - line.from.t)*w, (line.to.r - line.from.r)*h);
        const wid = 1;
        return {
          ...line,
          style: {
            left: (20-wid/2+(line.from.t+line.to.t)/2*w)+'px',
            top: (20-len/2+(line.from.r+line.to.r)/2*h)+'px',
            height: len+'px',
            width: wid+'px',
            transform: 'rotate('+(-rotate)+'rad)'
          }
        };
      });
    }  

    const plots3 = this.diagram.getTimeAxis();
    this.sideTimes = plots3.map(plot => ({
      ...plot,
      style: plotToStyle(plot)
    }));
    
    const timeBounds = this.diagram.getTimeBounds();
    this.minTime = timeBounds.minTime;
    this.maxTime = timeBounds.maxTime;

    this.minTimeStr = Util.timeToString(this.minTime);
    this.maxTimeStr = Util.timeToString(this.maxTime);
  }

  select(stop: TripStop):void {
    this.selectedStop = stop;
  }

  time(type: number, time: number): void {
    const timeBounds = this.diagram.getTimeBounds();
    if(type === 0) {
      timeBounds.minTime += time*1800;
    } else if(type === 1) {
      timeBounds.maxTime += time*1800;
    }
    this.diagram.setTimeBounds(timeBounds.minTime, timeBounds.maxTime);
    this.init();
  }

  move(type: number, time: number): void {
    if(!this.selectedStop) return;

    const route = this.selectedStop.meta.route;
    const routeStop = this.selectedStop.meta.routeStop;

    if(type === 3) {
      const trips = (getAllOfStorable(TYPES.Trip) as Trip[]).filter(t => t.getRoute() === route);
      for(let trip of trips) {
        trip.setDepartureTime(trip.getDepartureTime()+time*60);
      }
    } else if(type === 2) {
      let write = false;
      for(let stop of route.getWaypoints()) {
        if(stop === routeStop) {
          write = true;
        }
        if(write) {
          if(stop.hasDepartureTime()) {
            stop.setDepartureTime(stop.getDepartureTime()+time*60);
          }
          if(stop.hasArrivalTime()) {
            stop.setArrivalTime(stop.getArrivalTime()+time*60);
          }
        }
      }
    } else if(type === 1) {
      const trips = (getAllOfStorable(TYPES.Trip) as Trip[]).filter(t => t.getRoute() === route);
      for(let trip of trips) {
        trip.setDepartureTime(trip.getDepartureTime()+time*60);
      }

      let write = false;
      for(let stop of route.getWaypoints()) {
        if(write) {
          if(stop.hasDepartureTime()) {
            stop.setDepartureTime(stop.getDepartureTime()-time*60);
          }
          if(stop.hasArrivalTime()) {
            stop.setArrivalTime(stop.getArrivalTime()-time*60);
          }
        }

        if(stop === routeStop) {
          write = true;
        }
      }
    } else if(type === 0) {
      if(routeStop.hasDepartureTime()) {
        routeStop.setDepartureTime(routeStop.getDepartureTime()+time*60);
      }
      if(routeStop.hasArrivalTime()) {
        routeStop.setArrivalTime(routeStop.getArrivalTime()+time*60);
      }
    } else if(type === 4) {
      const trips = (getAllOfStorable(TYPES.Trip) as Trip[]).filter(t => t.getRoute() === route);
      for(let trip of trips) {
        trip.setDepartureTime(trip.getDepartureTime()+time*60);
      }

      let write = false;
      for(let stop of route.getWaypoints()) {
        if(write) {
          if(stop.hasDepartureTime()) {
            stop.setDepartureTime(stop.getDepartureTime()-time*60);
          }
          if(stop.hasArrivalTime()) {
            stop.setArrivalTime(stop.getArrivalTime()-time*60);
          }
        }

        if(stop === routeStop) {
          stop.setArrivalTime(stop.getArrivalTime() || stop.getDepartureTime());
          if(stop.hasDepartureTime()) {
            stop.setDepartureTime(stop.getDepartureTime()-time*60);
          }
          write = true;
        }
      }
    } else if(type === 5) {
      let write = false;
      for(let stop of route.getWaypoints()) {
        if(write) {
          if(stop.hasDepartureTime()) {
            stop.setDepartureTime(stop.getDepartureTime()+time*60);
          }
          if(stop.hasArrivalTime()) {
            stop.setArrivalTime(stop.getArrivalTime()+time*60);
          }
        }
        if(stop === routeStop) {
          write = true;
          stop.setArrivalTime(stop.getArrivalTime() || stop.getDepartureTime());
          if(stop.hasDepartureTime()) {
            stop.setDepartureTime(stop.getDepartureTime()+time*60);
          }
        }
      }
    }

    this.init();
  }
}
</script>

<style scoped>
#map-field {
  width: 100%;
  height: calc(100% - 40px);
  position: relative;
  border: 1px solid red;
  overflow: hidden;
}

.stop-plot {
  border-radius: 50%;
  border: 1px solid darkblue;
  background-color: blue;
  position: absolute;
}

.stop-plot.selected-stop {
  border: 1px solid darkred;
  background-color: red;
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

.side-line,
.stop-line {
  background-color: black;
  position: absolute;
}

</style>
