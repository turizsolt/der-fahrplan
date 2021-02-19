import { Container, interfaces } from 'inversify';

interface Initable<T> {
  init: () => T;
}

type InterfaceType<T> = new (...args: any[]) => T;

export class DependencyContainer {
  private instances: Record<symbol, Initable<any>> = {};

  constructor(private container: Container) {}

  map<T>(t1: symbol, t2: InterfaceType<T>) {
    this.container.bind<T>(t1).to(t2);
  }

  factory<T>(ft: symbol, t: symbol) {
    this.container
      .bind<interfaces.Factory<T>>(ft)
      .toFactory<T>((context: interfaces.Context) => {
        return () => {
          return context.container.get<T>(t);
        };
      });
  }

  fm<T>(ft: symbol, t1: symbol, t2: InterfaceType<T>) {
    this.map<T>(t1, t2);
    this.factory<T>(ft, t1);
  }

  sng<T extends Initable<T>>(ft: symbol, t: symbol, t2: InterfaceType<T>) {
    this.singleton<T>(ft, t, t2);
  }

  singleton<T extends Initable<T>>(
    ft: symbol,
    t: symbol,
    t2: InterfaceType<T>
  ) {
    let instance: T = this.instances[ft];
    this.container
      .bind<interfaces.Factory<T>>(ft)
      .toFactory<T>((context: interfaces.Context) => {
        return () => {
          if (!instance) {
            this.map<T>(t, t2);
            instance = context.container.get<T>(t).init();
            this.instances[ft] = instance;
          }
          return instance;
        };
      });
  }
}
