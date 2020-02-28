import { injectable } from 'inversify';

@injectable()
export class BaseBabylonRenderer {
  protected selected: boolean = false;

  update() {}
  process(command: string): void {}

  setSelected(selected: boolean): void {
    this.selected = selected;
    this.update();
  }

  isSelected(): boolean {
    return this.selected;
  }
}
