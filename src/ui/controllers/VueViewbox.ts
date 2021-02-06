import Vue from 'vue';
import { InputController } from './InputController';

export class VueViewbox {
  private vm: any;

  constructor(private inputController: InputController) {
    const _this = this;
    this.vm = new Vue({
      el: '#view-holder',
      data: {
        selected: '',
        buttons: []
      },
      methods: {
        handleClick: function (event) {
          _this.inputController.selectView(event.target.id);
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
