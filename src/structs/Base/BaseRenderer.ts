export interface BaseRenderer {
  setSelected(selected: boolean): void;
  isSelected(): boolean;
  process(command: string): void;
  update();
  remove();
}
