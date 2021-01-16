import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/TYPES';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { Store } from '../Interfaces/Store';

@injectable()
export abstract class ActualBaseStorable implements BaseStorable {
  protected id: string;

  @inject(TYPES.FactoryOfStore) StoreFactory: () => Store;
  protected store: Store;
  protected type: symbol;

  abstract persist(): Object;
  abstract load(obj: Object, store: Store): void;

  public persistDeep(): Object {
    return this.persist();
  }

  public persistShallow(): Object {
    return this.persist();
  }

  protected initStore(type: symbol) {
    this.type = type;
    this.store = this.StoreFactory();
    this.id = this.store.register(this, this.id);
  }

  presetId(id: string) {
    this.id = id;
  }

  getType(): symbol {
    return this.type;
  }

  getId() {
    return this.id;
  }

  private selected: boolean = false;

  select(): void {
    this.selected = true;
    this.store.setSelected(this);
    this.onSelectChanged(true);
    // még kell valami, ami update-el
  }

  deselect(): void {
    this.selected = false;
    this.store.setSelected(null);
    this.onSelectChanged(false);
  }

  isSelected(): boolean {
    return this.selected;
  }

  toggleSelect(): void {
    if (this.isSelected()) {
      this.deselect();
    } else {
      this.select();
    }
  }

  removeSelect(): void {
    this.selected = false;
    this.onSelectChanged(false);
  }

  onSelectChanged(selected: boolean): void { }
}
