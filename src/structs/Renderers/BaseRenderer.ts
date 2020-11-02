export interface BaseRenderer {
  process(command: string): void;
  update();
  remove();
}
