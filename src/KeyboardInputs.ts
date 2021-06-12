import { InputController } from './ui/controllers/InputController';

export class KeyboardInputs {
  private map: Record<string, boolean> = {};

  constructor(private inputController: InputController) {
    this.keyUp = this.keyUp.bind(this);
    this.keyDown = this.keyDown.bind(this);
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);
  }

  fireKeyHolds(): void {
    for (let key of Object.keys(this.map)) {
      if (this.map[key] && !this.modifier(key)) {
        this.inputController.keyHold(key, {
          shift: this.map['Shift'],
          ctrl: this.map['Control']
        });
      }
    }
  }

  private keyDown(event: KeyboardEvent): void {
    const key = this.upper(event.key);
    if (!this.map[key]) {
      if (!this.modifier(key)) {
        this.inputController.keyDown(key, {
          shift: this.map['Shift'],
          ctrl: this.map['Control']
        });
      }
    }
    this.map[key] = event.type == 'keydown';
  }

  private keyUp(event: KeyboardEvent): void {
    const key = this.upper(event.key);
    if (!this.modifier(key)) {
      this.inputController.keyUp(key, {
        shift: this.map['Shift'],
        ctrl: this.map['Control']
      });
    }

    this.map[key] = event.type == 'keydown';
  }

  private modifier(key: string): boolean {
    const list = ['Shift', 'Control', 'Alt'];
    return list.includes(key);
  }

  private upper(key: string): string {
    return key[0].toUpperCase() + key.slice(1);
  }
}
