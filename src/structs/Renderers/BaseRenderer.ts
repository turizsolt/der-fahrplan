export interface BaseRenderer {
  init(data?: any): void;
  process(command: string): void;
  update(data?: any): void;
  remove(data?: any): void;
}
