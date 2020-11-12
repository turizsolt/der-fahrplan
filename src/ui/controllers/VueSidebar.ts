import Vue from 'vue/dist/vue.js';
import { Store } from '../../structs/Interfaces/Store';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Route } from '../../structs/Scheduling/Route';

export class VueSidebar {
  private vmInfoBox: Vue;

  constructor(private store: Store) {
    this.vmInfoBox = new Vue({
      el: '#info-box',
      data: { selected: null, type: null, opts: [], tickCount: '0:00' }
    });

    Vue.component('idtext', {
      props: ['idt', 'obj'],
      template: '<div>{{idt}}</div>'
    });

    Vue.component('wagon', {
      props: ['idt', 'obj', 'opts'],
      template: `
    <div>
      <div class="item-type">🚂 Mozdony</div>
      <div class="item-id">{{idt}}</div>
      <div class="item-id">Speed: {{obj.speed ? obj.speed : '???'}}</div>
      <div v-if="obj.trip">
        <div class="trip">
          <div class="trip-name">{{obj.trip.name}}</div> 
          <div class="trip-destination">▶ {{obj.trip.destination}}</div> 
        </div>
        <div v-for="(stop, id) in obj.trip.stops">
          <div class="stop">
              <div class="stop-circle" :style="{backgroundColor: stop.rgbColor}"></div>
              <div v-if="id !== obj.trip.stops.length-1" class="stop-after color"></div>
              <div v-if="id === obj.trip.stops.length-1" class="stop-after nocolor"></div>
              <div class="stop-name">{{stop.stationName}}</div>
          </div>
        </div>
        <div class="trip-buttons">
          <div class="trip-buttons-inner">
            <div class="xbutton trip-cancel" @click="removeRoute(obj)">❌ Útirány törlése</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="opts && opts.length > 0">
          <div>Útirány kiválasztása...</div>
          <div class="route-line" v-for="route in opts" @click="assignRoute(obj, route.id)"> 
            <div class="route-sign">{{route.name}}</div>
            <div class="route-circle route-circle-left" :style="{backgroundColor: route.stops[0].rgbColor}"></div>
            <div class="route-circle route-circle-right" :style="{backgroundColor: route.stops[route.stops.length-1].rgbColor}"></div>
            <div class="route-name">
              {{route.stops[0].stationName}}
              >
              {{route.stops[route.stops.length-1].stationName}}
            </div>
          </div>
        </div>
        <div v-if="!opts || opts.length === 0">
        <select class="route-select" size="1" disabled>
            <option>Nincs kiválsztható útirány</option>
          </select>
        </div>
      </div>
    </div>
    `,
      methods: {
        assignRoute: function(vWagon, vRouteId) {
          if (!vRouteId) return;
          const wagon = this.store.get(vWagon.id) as Wagon;
          const route = this.store.get(vRouteId) as Route;
        },
        removeRoute: function(vWagon) {
          const wagon = this.store.get(vWagon.id) as Wagon;
          wagon.cancelTrip();
        }
      }
    });
  }

  setData(name: string, value: any) {
    this.vmInfoBox[name] = value;
  }
}
