import Vue from 'vue';
import { CommandMode } from '../../structs/Actuals/Store/Command/CommandMode';
import { Store } from '../../structs/Interfaces/Store';

export class VueTestPanel {
  private vmTestPanel: any;

  constructor(private store: Store) {
    const _actionStore = this.store.getCommandLog();
    this.vmTestPanel = new Vue({
      el: '#test-panel',
      data: {
        show: true,
        actions: [],
        mode: CommandMode.Master
      },
      methods: {
        load: function () {
          this.actions = _actionStore.getActions();
        },
        rewind: function () {
          _actionStore.runAllBack();
        },
        prev: function () {
          _actionStore.runPrev();
        },
        next: function () {
          _actionStore.runNext();
        },
        run: function () {
          _actionStore.runAll();
        }
      }
    });
    _actionStore.on('updated', data => {
      this.vmTestPanel.actions = data.actions;
      this.vmTestPanel.mode = data.mode;
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
