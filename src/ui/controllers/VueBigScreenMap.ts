import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import RoutePlanner from './RoutePlanner.vue';
import RailMapShower from './RailMapShower.vue';
import { RailMapCreator } from '../../modules/RailMap/RailMapCreator';
import { getStore } from '../../structs/Actuals/Store/StoreForVue';
import { DiagramCreator } from '../overlays/DiagramCreator';

export class VueBigscreenMap {
  private vmBigScreen: any;

  constructor(private store: Store) {
    Vue.component('route-planner', RoutePlanner);
    Vue.component('rail-map-shower', RailMapShower);

    this.vmBigScreen = new Vue({
      el: '#big-screen-map',
      data: {
        show: false
      },
      methods: {},
      computed: {
        style: function () { return this.show ? 'visibility: visible;' : 'visibility: hidden;'; }
      }
    });
  }

  toggleShow() {
    this.setShow(!this.vmBigScreen.show);
  }

  setShow(show: boolean) {
    this.vmBigScreen.show = show;
    if (this.vmBigScreen.show) {
      const store: Store = getStore();
      RailMapCreator.create(store);
      setTimeout(() => DiagramCreator.create(store), 0);
    }
  }
}
