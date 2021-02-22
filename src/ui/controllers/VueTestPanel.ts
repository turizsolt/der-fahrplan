import Vue from 'vue';
import { Store } from '../../structs/Interfaces/Store';

export class VueTestPanel {
  private vmTestPanel: any;

  constructor(private store: Store) {
    const _actionStore = this.store.getActionStore();
    this.vmTestPanel = new Vue({
      el: '#test-panel',
      data: {
        show: true,
        actions: []
      },
      methods: {
        load: function () {
          this.actions = _actionStore.getActions();
        },
        next: function () {
          _actionStore.runNext();
        },
        run: function () {
          _actionStore.runAll();
        }
      }
    });
    _actionStore.on('updated', actions => {
      this.vmTestPanel.actions = actions;
    });
  }

  toggleShow() {
    this.vmTestPanel.show = !this.vmTestPanel.show;
    if (this.vmTestPanel.show) {
      this.vmTestPanel.load();
    }
  }

  setShow(show: boolean) {
    this.vmTestPanel.show = show;
    if (this.vmTestPanel.show) {
      this.vmTestPanel.load();
    }
  }
}
