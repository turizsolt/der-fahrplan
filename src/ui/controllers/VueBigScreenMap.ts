import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import RailMapShower from './RailMapShower.vue';

export class VueBigscreenMap {
  private vmBigScreen: any;

  constructor(private store: Store) {
    this.vmBigScreen = new Vue({
      el: '#big-screen-map',
      data: {
        show: false
      },
      methods: {}
    });

    Vue.component('rail-map-shower', RailMapShower);
  }

  toggleShow() {
    this.vmBigScreen.show = !this.vmBigScreen.show;
  }

  setShow(show: boolean) {
    this.vmBigScreen.show = show;
  }
}
