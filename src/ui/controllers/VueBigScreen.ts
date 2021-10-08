import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import AddTrip from './AddTrip.vue';
import TripPlanner from './TripPlanner.vue';
import ScheduleGrid from './ScheduleGrid.vue';
import RouteSign from './RouteSign.vue';

export class VueBigscreen {
  private vmBigScreen: any;

  constructor(private store: Store) {
    this.vmBigScreen = new Vue({
      el: '#big-screen',
      data: {
        show: false
      },
      methods: {}
    });

    Vue.component('add-trip', AddTrip);
    Vue.component('route-sign', RouteSign);
    Vue.component('schedule-grid', ScheduleGrid);
    Vue.component('trip-planner', TripPlanner);
  }

  toggleShow() {
    this.vmBigScreen.show = !this.vmBigScreen.show;
  }

  setShow(show: boolean) {
    this.vmBigScreen.show = show;
  }
}
