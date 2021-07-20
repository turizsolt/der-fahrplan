import Vue from 'vue';
import { GlobalController } from './GlobalController';

export class VueViewbox {
  private vm: any;

  constructor(private globalController: GlobalController) {
    const _this = this;
    this.vm = new Vue({
      el: '#view-holder',
      data: {
        selected: '',
        buttons: []
      },
      methods: {
        handleClick: function(event) {
          _this.globalController.selectView(event.target.id);
        }
      }
    });
  }

  addButton(button: { id: string; text: string }): void {
    this.vm.buttons.push(button);
  }

  setSelected(mode: string): void {
    this.vm.selected = mode;
  }
}
