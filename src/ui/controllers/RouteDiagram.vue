<template>
  <div id="map-field">
    Ide jon minden, Diagram
    <hr />
    <div v-for="stop in sideStops" :key="stop.id" class="side-stop" :title="stop.name" :style="stop.style"></div>
    
    <!--
    <div v-for="edge in edges" class="edge" :style="edge.style"></div>  
    <div v-for="node in nodes" class="node-text" :style="{left: node.textLeft, top: node.textTop, display: node.textDisplay}">{{node.getName()}}</div>  
    <div v-for="node in nodes" @click="$emit('addStop', $event, node.getId())" class="node" :style="{left: node.left, top: node.top, width: node.size, height: node.size, backgroundColor: node.bgColor}" :title="node.getName()"></div>  
    -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TYPES } from "../../di/TYPES";
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

      this.sideStops = [];
      if(route) {
        let position:number = 0;
        let prevStop:RouteStop = null;
        let maxHeight:number = 0;
        let pos: number = 0;

        const mapField = document.getElementById('map-field');
        const h = mapField.clientHeight - 40;
        
        for(let stop of route.getWaypoints()) {
          if(prevStop) {
            maxHeight += this.map.getDistance(prevStop.getWaypoint(), stop.getWaypoint());
          }
          prevStop = stop;
        }
        
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
                  left: (20-10)+'px',
                  top: (20-10+pos/maxHeight*h)+'px',
                  width: '20px',
                  height: '20px'
              }
          });
          prevStop = stop;
        }
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

.side-stop {
  border-radius: 50%;
  border: 1px solid orange;
  background-color: yellow;
  position: absolute;
}

/*
.node {
  border-radius: 50%;
  border: 1px solid blue;
  position: absolute;
}

.node-text {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.75);
}

.edge {
  background-color: black;
  position: absolute;
}

.node:hover {
  cursor: pointer;
}
*/
</style>
