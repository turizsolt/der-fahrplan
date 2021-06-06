import Vue from 'vue';
import { GlobalController, InputMode } from './GlobalController';

export class VueToolbox {
  private vm: any;

  constructor(private globalController: GlobalController) {
    const _this = this;
    this.vm = new Vue({
      el: '#button-holder',
      data: {
        selected: '',
        buttons: [],
        wagon: 'wagon',
        show: false
      },
      methods: {
        handleClick: function(event) {
          _this.globalController.selectMode(event.target.id);
        },
        handleWagonClick: function(event) {
          this.wagon = event.target.value;
        }
      }
    });
  }

  addButton(button: { id: string; text: string }): void {
    this.vm.buttons.push(button);
  }

  getWagon(): string {
    return this.vm.wagon;
  }

  setSelected(mode: InputMode): void {
    this.vm.selected = mode;
  }

  setShow(show: boolean): void {
    this.vm.show = show;
  }
}
