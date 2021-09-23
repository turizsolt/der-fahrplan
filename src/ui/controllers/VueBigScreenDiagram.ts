import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';
import DiagramPlanner from './DiagramPlanner.vue';
import RouteDiagram from './RouteDiagram.vue';

export class VueBigscreenDiagram {
  private vmBigScreen: any;

  constructor(private store: Store) {
    this.vmBigScreen = new Vue({
      el: '#big-screen-diagram',
      data: {
        show: false
      },
      methods: {}
    });

    Vue.component('diagram-planner', DiagramPlanner);
    Vue.component('route-diagram', RouteDiagram);
  }

  toggleShow() {
    this.vmBigScreen.show = !this.vmBigScreen.show;
  }

  setShow(show: boolean) {
    this.vmBigScreen.show = show;
  }
}
