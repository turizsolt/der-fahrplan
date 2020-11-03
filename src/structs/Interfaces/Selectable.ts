export interface Selectable {
  select(): void;
  deselect(): void;
  toggleSelect(): void;
  isSelected(): boolean;
  removeSelect(): void;
  onSelectChanged(selected: boolean): void;
}
