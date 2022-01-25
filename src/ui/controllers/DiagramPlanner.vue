<template>
  <div class="big-screen-one">
    <div class="column-routes" id="route-list">
      <div class="column-title">Route list</div>
      <route-title
        :key="route.id"
        v-for="route in routes"
        :route="route"
        :selected="selectedRoute && selectedRoute.id === route.id"
        candelete
        @click="selectRoute(route)"
        @delete="removeRoute(route)"
      ></route-title>
      <div class="route-create-holder">
        <span class="route-create" v-on:click="createRoute()"
          >Create route</span
        >
      </div>
    </div>
    <div class="column-route-stops" id="route-details">
      <div class="column-title">Edit route</div>
      <div v-if="selectedRoute">
        <div class="route-details">
          Name:
          <input
            class="route-input-name"
            type="text"
            v-model="selectedRoute.name"
            @keyup.stop="nameChange"
          /><br />
        </div>
        <div class="route-details">
          Color:
          <input
            class="route-input-name"
            type="text"
            v-model="selectedRoute.color"
            @keyup.stop="colorChange"
          /><br />
        </div>
        <div class="route-details-stops">
          Stops:<br />
          <route-stop
            v-for="(stop, index) in selectedRoute.stops"
            :key="stop.id"
            :route="selectedRoute"
            :stop="stop"
            :index="index"
            candelete
            :canmove="index !== 0"
            @delete="deleteStop(stop)"
            @reverse="reverseStop(stop)"
            @shouldStop="shouldStop(stop)"
          >
          </route-stop>
        </div>
        <div class="route-details route-create-holder">
          <span
            class="route-create"
            v-on:click="createReverseRoute(selectedRoute)"
            >Create reverse route</span
          >
        </div>
      </div>
    </div>
    <route-diagram :route="selectedRoute"></route-diagram>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Route } from "../../structs/Scheduling/Route";
import { Station } from "../../modules/Station/Station";
import { TYPES } from "../../di/TYPES";
import {
  getStore,
  getAllOfStorable,
  getStorable,
  createStorable,
} from "../../structs/Actuals/Store/StoreForVue";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapNode } from "../../modules/RailMap/RailMapNode";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";

@Component
export default class DiagramPlanner extends Vue {
  private map: RailMap;
  routes: any[] = [];
  selectedRoute: any = null;

  created() {
    this.map = RailMapCreator.create(getStore());
    this.load();
  }

  load() {
    this.routes = getAllOfStorable<Route>(TYPES.Route).map((x) =>
      x.persistDeep()
    );
    if (this.selectedRoute) {
      this.selectedRoute = (
        getStorable(this.selectedRoute.id) as Route
      ).persistDeep();
    }
  }

  removeRoute(vRoute) {
    const route = getStorable(vRoute.id) as Route;
    route.remove();
    this.selectedRoute = null;
    this.load();
  }

  createRoute() {
    const route = createStorable<Route>(TYPES.Route);
    route.init();
    this.load();
    const routeData = this.routes.find((x) => x.id === route.getId());
    this.selectRoute(routeData);
  }

  createReverseRoute(vRouteFrom) {
    /*const routeFrom = getStorable(vRouteFrom.id) as Route;
    const route = createStorable<Route>(TYPES.Route);
    route.init();
    route.setName(routeFrom.getName());
    for (let stopFrom of [...routeFrom.getWaypoints()].reverse()) {
      /*const stop = createStorable<RouteStop>(TYPES.RouteStop);
            stop.init(stopFrom.getStation(), stopFrom.getPlatform());
            route.addWaypoint(stop);*
    }
    this.load();
    const routeData = this.routes.find((x) => x.id === route.getId());
    this.selectRoute(routeData);*/
  }

  selectRoute(route) {
    this.selectedRoute = route;
    this.load();
  }

  deleteStop(vStop) {
    /*const stop = getStorable(vStop.id) as RouteStop;
          const route = getStorable(this.selectedRoute.id) as Route;
          route.removeStop(stop);

          this.checkFirstAndLastStop();
          this.load();*/
  }

  reverseStop(vStop) {
    /*const stop = getStorable(vStop.id) as RouteStop;
          stop.toggleReverseStop();
          this.load();*/
  }

  shouldStop(vStop) {
    /*const stop = getStorable(vStop.id) as RouteStop;
          stop.setShouldStop(!stop.getShouldStop());

          this.checkFirstAndLastStop();
          this.load();*/
  }

  checkFirstAndLastStop() {
    /*const route = getStorable(this.selectedRoute.id) as Route;
    const stops = route.getWaypoints();
    if (stops.length > 0) {
      const firstStop = stops[0];
      if (!firstStop.getShouldStop()) {
        firstStop.setShouldStop(true);
      }

      if (stops.length > 1) {
        const lastStop = stops[stops.length - 1];
        if (!lastStop.getShouldStop()) {
          lastStop.setShouldStop(true);
        }
      }
    }*/
  }

  addStop(evt, stationId) {
    /*if (this.selectedRoute) {
      const route = getStorable(this.selectedRoute.id) as Route;
      const station = getStorable(stationId) as Station;

      let addingStations: RailMapNode[] = [station];
      if (route.getLastWaypoint()) {
        const result = this.map.getShortestPath(
          route.getLastWaypoint(),
          station
        );
        addingStations = result.slice(1);
      }
      const last = addingStations[addingStations.length - 1];

      for (let station of addingStations) {
        /*const stop = createStorable<RouteStop>(TYPES.RouteStop);
              stop.init(
                station
              );
              if(station !== last) {
                stop.setShouldStop(false);
              }
              route.addWaypoint(stop);*
      }
      this.load();
    }*/
  }

  nameChange(event) {
    const route = getStorable(this.selectedRoute.id) as Route;
    route.setName(event.target.value);
    this.load();
  }

  colorChange(event) {
    const route = getStorable(this.selectedRoute.id) as Route;
    route.setColor(event.target.value);
    this.load();
  }
}
</script>

<style>
.big-screen-one {
  display: flex;
  height: 100%;
}

.column-routes {
  width: 200px;
  min-width: 200px;
}

.column-route-stops {
  width: 280px;
  min-width: 280px;
}

.column-add-stops {
  overflow-y: scroll;
}
</style>
