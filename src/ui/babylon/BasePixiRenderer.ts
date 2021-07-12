import { injectable } from 'inversify';

@injectable()
export class BasePixiRenderer {
  protected selected: boolean = false;

  update(data?: any) {}
  remove() {}

  process(command: string): void {}
}
