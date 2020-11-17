import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Route } from '../../structs/Scheduling/Route';
import { Station } from '../../structs/Scheduling/Station';
import { RouteStop } from '../../structs/Scheduling/RouteStop';
import AddTrip from './AddTrip.vue';

export class VueBigscreen {
  private vmBigScreen: any;

  constructor(private store: Store) {
    const _this = this;
    this.vmBigScreen = new Vue({
      el: '#big-screen',
      data: {
        show: false,
        routes: [],
        selectedRoute: null,
        stations: []
      },
      methods: {
        load: function() {
          this.routes = _this.store
            .getAllOf<Route>(TYPES.Route)
            .map(x => x.persistDeep());
          this.stations = _this.store
            .getAllOf<Station>(TYPES.Station)
            .map(x => x.persistDeep());
          if (this.selectedRoute) {
            this.selectedRoute = (_this.store.get(
              this.selectedRoute.id
            ) as Route).persistDeep();
          }
        },
        removeRoute: function(vRoute) {
          const route = _this.store.get(vRoute.id) as Route;
          route.remove();
          this.selectedRoute = null;
          this.load();
        },
        createRoute: function() {
          const route = _this.store.create<Route>(TYPES.Route);
          route.init();
          this.load();
        },
        createReverseRoute: function(vRouteFrom) {
          const routeFrom = _this.store.get(vRouteFrom.id) as Route;
          const route = _this.store.create<Route>(TYPES.Route);
          route.init();
          route.setName(routeFrom.getName());
          for (let stopFrom of [...routeFrom.getStops()].reverse()) {
            const stop = _this.store.create<RouteStop>(TYPES.RouteStop);
            stop.init(stopFrom.getStation(), stopFrom.getPlatform());
            route.addStop(stop);
          }
          this.load();
        },
        selectRoute: function(route) {
          this.selectedRoute = route;
          this.load();
        },
        deleteStop: function(vStop) {
          const stop = _this.store.get(vStop.id) as RouteStop;
          const route = _this.store.get(this.selectedRoute.id) as Route;
          route.removeStop(stop);
          this.load();
        },
        swapStop: function(vStop) {
          const stop = _this.store.get(vStop.id) as RouteStop;
          const route = _this.store.get(this.selectedRoute.id) as Route;
          route.swapStopWithPrev(stop);
          this.load();
        },
        addStop: function(vStation) {
          if (this.selectedRoute) {
            const route = _this.store.get(this.selectedRoute.id) as Route;
            const station = _this.store.get(vStation.id) as Station;
            const stop = _this.store.create<RouteStop>(TYPES.RouteStop);
            stop.init(
              station,
              station.getPlatforms().length > 0 && station.getPlatforms()[0]
            );
            route.addStop(stop);
            this.load();
          }
        },
        nameChange: function(event) {
          const route = _this.store.get(this.selectedRoute.id) as Route;
          route.setName(event.target.value);
          this.load();
        },
        colorChange: function(event) {
          const route = _this.store.get(this.selectedRoute.id) as Route;
          route.setColor(event.target.value);
          this.load();
        }
      }
    });

    Vue.component('add-trip', AddTrip);
  }

  toggleShow() {
    this.vmBigScreen.show = !this.vmBigScreen.show;
    if (this.vmBigScreen.show) {
      this.vmBigScreen.load();
    }
  }
}
