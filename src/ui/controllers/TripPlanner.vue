<template>
  <div class="big-screen-one">
        <div class="column-routes" id="route-list">
            <div class="column-title">Route list</div>
            <route-title :key="route.id" v-for="route in routes" :route="route"
                :selected="selectedRoute && selectedRoute.id === route.id" candelete @click="selectRoute(route)"
                @delete="removeRoute(route)"></route-title>
            <div class="route-create-holder">
                <span class="route-create" v-on:click="createRoute()">Create route</span>
            </div>
        </div>
        <div class="column-route-stops" id="route-details">
            <div class="column-title">Edit route</div>
            <div v-if="selectedRoute">
                <div class="route-details">
                    Name:
                    <input class="route-input-name" type="text" v-model="selectedRoute.name"
                        @keyup.stop="nameChange" /><br />
                </div>
                <div class="route-details">
                    Color:
                    <input class="route-input-name" type="text" v-model="selectedRoute.color"
                        @keyup.stop="colorChange" /><br />
                </div>
                <div class="route-details-stops">
                    Stops:<br />
                    <route-stop v-for="(stop, index) in selectedRoute.stops" :key="stop.id" :route="selectedRoute"
                        :stop="stop" :index="index" candelete :canmove="index !== 0" @delete="deleteStop(stop)"
                        @move="swapStop(stop)" @reverse="reverseStop(stop)">
                    </route-stop>
                </div>
                <div class="route-details route-create-holder">
                    <span class="route-create" v-on:click="createReverseRoute(selectedRoute)">Create reverse
                        route</span>
                </div>
            </div>
        </div>
        <div class="column-add-trips">
            <div class="column-title">Add trips</div>
            <div v-if="selectedRoute">
                <add-trip :route="selectedRoute">
                </add-trip>
            </div>
        </div>
        <div class="column-add-stops" id="route-station-options">
            <div class="column-title">Add stops</div>
            <div v-if="selectedRoute">
                <div v-for="station in stations" :key="station.id">
                    <button v-on:click="addStop(station)" :style="{backgroundColor: station.rgbColor}">Add</button>
                    {{station.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Route } from "../../structs/Scheduling/Route";
import { Station } from "../../structs/Scheduling/Station";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { TYPES } from "../../di/TYPES";
import { getAllOfStorable, getStorable, createStorable } from "../../structs/Actuals/Store/StoreForVue";
import { get } from "http";

@Component
export default class TripPlanner extends Vue {
    routes: any[] = [];
    selectedRoute: any = null;
    stations: any[] = [];

    created() {
        this.load();
    }

    load() {
          this.routes = getAllOfStorable<Route>(TYPES.Route)
            .map(x => x.persistDeep());
          this.stations = getAllOfStorable<Station>(TYPES.Station)
            .map(x => Object.freeze(x.persistDeep()));
            this.stations.sort((a, b) => {
              if(a.name < b.name) return -1;
              if(a.name > b.name) return 1;
              return 0;
            });
          if (this.selectedRoute) {
            this.selectedRoute = (getStorable(
              this.selectedRoute.id
            ) as Route).persistDeep()
          }
        };

        removeRoute(vRoute) {
          const route = getStorable(vRoute.id) as Route;
          route.remove();
          this.selectedRoute = null;
          this.load();
        };

        createRoute() {
          const route = createStorable<Route>(TYPES.Route);
          route.init();
          this.load();
          const routeData = this.routes.find(x => x.id === route.getId());
          this.selectRoute(routeData);
        };

        createReverseRoute(vRouteFrom) {
          const routeFrom = getStorable(vRouteFrom.id) as Route;
          const route = createStorable<Route>(TYPES.Route);
          route.init();
          route.setName(routeFrom.getName());
          for (let stopFrom of [...routeFrom.getStops()].reverse()) {
            const stop = createStorable<RouteStop>(TYPES.RouteStop);
            stop.init(stopFrom.getStation(), stopFrom.getPlatform());
            route.addStop(stop);
          }
          this.load();
          const routeData = this.routes.find(x => x.id === route.getId());
          this.selectRoute(routeData);
        };

        selectRoute(route) {
          this.selectedRoute = route;
          this.load();
        };

        deleteStop(vStop) {
          const stop = getStorable(vStop.id) as RouteStop;
          const route = getStorable(this.selectedRoute.id) as Route;
          route.removeStop(stop);
          this.load();
        };

        reverseStop(vStop) {
          const stop = getStorable(vStop.id) as RouteStop;
          stop.toggleReverseStop();
          this.load();
        };

        swapStop(vStop) {
          const stop = getStorable(vStop.id) as RouteStop;
          const route = getStorable(this.selectedRoute.id) as Route;
          route.swapStopWithPrev(stop);
          this.load();
        };

        addStop(vStation) {
          if (this.selectedRoute) {
            const route = getStorable(this.selectedRoute.id) as Route;
            const station = getStorable(vStation.id) as Station;
            const stop = createStorable<RouteStop>(TYPES.RouteStop);
            stop.init(
              station,
              station.getPlatforms().length > 0 && station.getPlatforms()[0]
            );
            route.addStop(stop);
            this.load();
          }
        };

        nameChange(event) {
          const route = getStorable(this.selectedRoute.id) as Route;
          route.setName(event.target.value);
          this.load();
        };

        colorChange(event) {
          const route = getStorable(this.selectedRoute.id) as Route;
          route.setColor(event.target.value);
          this.load();
        };
}
</script>

<style>
.big-screen-one {
    display: flex;
}
.column-add-stops {
  height: 500px; /* todo arbitrary number */
  overflow-y: scroll;
}
</style>
