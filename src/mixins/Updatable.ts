export type UpdatableCallback = (data: any) => void;

export class Updatable {
  private updateCallbacks: UpdatableCallback[];

  init() {
    this.updateCallbacks = [];
  }

  subscribeToUpdates(callback: UpdatableCallback) {
    this.updateCallbacks.push(callback);
  }

  unsubscribeToUpdates(callback: UpdatableCallback) {
    this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
  }

  notify(data: any) {
    this.updateCallbacks.map(cb => cb(data));
  }
}
