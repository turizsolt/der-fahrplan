import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import VueIdtext from './VueIdtext.vue';
import VueWagon from './VueWagon.vue';
import RouteTitle from './RouteTitle.vue';

export class VueSidebar {
  private vmInfoBox: Vue;

  constructor(private store: Store) {
    this.vmInfoBox = new Vue({
      el: '#info-box',
      data: { selected: null, type: null, opts: [], tickCount: '0:00' }
    });

    Vue.component('route-title', RouteTitle);

    Vue.component('idtext', VueIdtext);
    Vue.component('wagon', VueWagon);
  }

  setData(name: string, value: any) {
    this.vmInfoBox[name] = value;
  }
}
