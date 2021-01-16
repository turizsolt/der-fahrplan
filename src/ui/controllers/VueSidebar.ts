import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import VueIdtext from './VueIdtext.vue';
import VueWagon from './VueWagon.vue';
import VueStation from './VueStation.vue';
import RouteTitle from './RouteTitle.vue';
import TripTitle from './TripTitle.vue';
import RouteStop from './RouteStop.vue';

export class VueSidebar {
  private vmInfoBox: Vue;

  constructor(private store: Store) {
    this.vmInfoBox = new Vue({
      el: '#info-box',
      data: { selected: null, type: null, opts: [], tickCount: '0:00' }
    });

    Vue.component('route-title', RouteTitle);
    Vue.component('route-stop', RouteStop);

    Vue.component('trip-title', TripTitle);

    Vue.component('idtext', VueIdtext);
    Vue.component('wagon', VueWagon);
    Vue.component('station', VueStation);
  }

  setData(name: string, value: any) {
    this.vmInfoBox[name] = value;
  }
}
