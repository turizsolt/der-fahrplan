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
import { getStore, getStorable, getAllOfStorable } from "../../structs/Actuals/Store/StoreForVue";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapNode } from "../../modules/RailMap/RailMapNode";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";
import { RailDiagram } from "../../modules/RailDiagram/RailDiagram";

@Component
export default class RouteDiagram extends Vue {
  private diagram: RailDiagram;
  @Prop() route: any;
  sideStops: any = [];
  sideTimes: any = [];
  stops: any = [];
  minTime: number = 0;
  maxTime: number = 60*60*24;

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
       
      const {plots: plots2, lines: lines2} = this.diagram.getPlotsAndLines();
      this.stops = plots2.map(plot => ({
        ...plot,
        style: plotToStyle(plot)
      }));
    }  

    const plots3 = this.diagram.getTimeAxis();
    this.sideTimes = plots3.map(plot => ({
      ...plot,
      style: plotToStyle(plot)
    }));
  }
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
