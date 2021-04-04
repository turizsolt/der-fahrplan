export type EmitableCallback = (data: any) => void;

export class Emitable {
  private updateCallbacks: Record<string, EmitableCallback[]>;

  on(event: string, callback: EmitableCallback) {
    if (!this.updateCallbacks) {
      this.updateCallbacks = {};
    }
    if (!this.updateCallbacks[event]) {
      this.updateCallbacks[event] = [];
    }
    this.updateCallbacks[event].push(callback);
  }

  off(event: string, callback: EmitableCallback) {
    this.updateCallbacks[event] = this.updateCallbacks[event].filter(
      cb => cb !== callback
    );
  }

  emit(event: string, data: any) {
    if (this.updateCallbacks[event]) {
      this.updateCallbacks[event].map(cb => cb(data));
    }
  }
}
