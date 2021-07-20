import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import TripConnector from './TripConnector.vue';

export class VueBigscreen2 {
  private vmBigScreen2: any;

  constructor(private store: Store) {
    this.vmBigScreen2 = new Vue({
      el: '#big-screen2',
      data: {
        show: false
      },
      methods: {}
    });

    Vue.component('trip-connector', TripConnector);
  }

  toggleShow() {
    this.vmBigScreen2.show = !this.vmBigScreen2.show;
  }

  setShow(show: boolean) {
    this.vmBigScreen2.show = show;
  }
}
