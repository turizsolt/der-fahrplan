<template>
  <div id="map-field">
    <div
      :key="edge.id"
      v-for="edge in edges"
      class="edge"
      :style="edge.style"
    ></div>
    <div
      :key="node.id + '-text'"
      v-for="node in nodes"
      class="node-text"
      :style="{
        left: node.textLeft,
        top: node.textTop,
        display: node.textDisplay,
      }"
    >
      {{ node.getName() }}
    </div>
    <div
      :key="node.id"
      v-for="node in nodes"
      @click="$emit('addStop', $event, node.getId())"
      class="node"
      :style="{
        left: node.left,
        top: node.top,
        width: node.size,
        height: node.size,
        backgroundColor: node.bgColor,
      }"
      :title="node.getName()"
    ></div>
    <div
      :key="ind + 10000000000000"
      v-for="(route, ind) in routes"
      @click="$emit('addStop', $event, node.getId())"
    >
      <div
        :key="ind + '-' + index"
        v-for="(line, index) in route"
        class="line"
        :style="line.style"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TYPES } from "../../di/TYPES";
import { Route } from "../../structs/Scheduling/Route";
import { Station } from "../../modules/Station/Station";
import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";

@Component
export default class RailMapShower extends Vue {
  private map: RailMap;
  nodes: any[] = [];
  edges: any[] = [];
  routes: any[] = [];

  constructor() {
    super();

    this.init = this.init.bind(this);

    setTimeout(() => {
      this.init();
    }, 0);
  }

  init() {
    this.map = RailMapCreator.create(getStore());

    this.nodes = this.map.getNodes();
    const gotEdges = this.map.getEdges();
    this.edges = [];
    for (let key of Object.keys(gotEdges)) {
      this.edges.push(gotEdges[key]);
    }
    this.routes = this.map.getRoutes().reverse();

    const mapField = document.getElementById("map-field");
    const w = mapField.clientWidth - 40;
    const h = mapField.clientHeight - 40;
    const bounds = this.map.getBounds();
    const wRange = bounds.maxX - bounds.minX;
    const hRange = bounds.maxZ - bounds.minZ;
    const m = Math.max(wRange / w, hRange / h);

    // center at 10,10 !!!
    const left = (c) => (c.x - bounds.minX) / m;
    const top = (c) => (c.z - bounds.minZ) / m;
    const dist = (c) => c / m;

    for (let i = 0; i < this.nodes.length; i++) {
      const coord = this.nodes[i].getCoord();
      const size = this.nodes[i].getType() === TYPES.Station ? 20 : 10;
      this.nodes[i].left = 20 + left(coord) - size / 2 + "px";
      this.nodes[i].top = 20 + top(coord) - size / 2 + "px";
      this.nodes[i].size = size + "px";
      this.nodes[i].textLeft = 20 + left(coord) + size / 2 + "px";
      this.nodes[i].textTop = 20 + top(coord) + size / 2 + "px";
      this.nodes[i].textDisplay =
        this.nodes[i].getType() === TYPES.Station ? "block" : "none";
      this.nodes[i].bgColor =
        this.nodes[i].getType() === TYPES.Station ? "aqua" : "gray";
    }

    for (let i = 0; i < this.edges.length; i++) {
      const coord = this.edges[i].from
        .getCoord()
        .midpoint(this.edges[i].to.getCoord());
      const wi = dist(
        this.edges[i].from.getCoord().distance2d(this.edges[i].to.getCoord())
      );
      const r = this.edges[i].from
        .getCoord()
        .whichDir2d(this.edges[i].to.getCoord());
      const e = Math.min(this.edges[i].count, 4);
      this.edges[i].id = i;
      this.edges[i].style = {
        left: 20 + left(coord) - (e * 3) / 2 + "px",
        top: 20 + top(coord) - wi / 2 + "px",
        height: wi + "px",
        width: e * 3 + "px",
        transform: "rotate(" + -r + "rad)",
      };
    }

    for (let i = 0; i < this.routes.length; i++) {
      for (let j = 0; j < this.routes[i].length; j++) {
        const from = this.routes[i][j].from.fromHere(
          Math.PI / 2,
          this.routes[i][j].no * 3 // todo
        );
        const to = this.routes[i][j].to.fromHere(
          -Math.PI / 2,
          this.routes[i][j].no * 3 // todo
        );

        const coord = from.coord.midpoint(to.coord);
        const wi = dist(from.coord.distance2d(to.coord));
        const r = from.coord.whichDir2d(to.coord);
        const e = 2; //this.routes[i][j].no * 2 + 2;
        this.routes[i][j].id = i;
        this.routes[i][j].style = {
          left: 20 + left(coord) - (e * 3) / 2 + "px",
          top: 20 + top(coord) - wi / 2 + "px",
          height: wi + "px",
          width: e * 3 + "px",
          transform: "rotate(" + -r + "rad)",
          backgroundColor: this.routes[i][j].color,
        };
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
  background-color: gray;
  position: absolute;
}

.line {
  background-color: black;
  position: absolute;
}

.node:hover {
  cursor: pointer;
}
</style>
