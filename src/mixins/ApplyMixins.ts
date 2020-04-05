export function applyMixins(
  derivedCtor: any,
  baseCtors: any[] = [],
  superBaseCtors: any[] = []
) {
  const inits = [];
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name !== 'init' && name !== 'constructor') {
        const dd = Object.getOwnPropertyDescriptor(derivedCtor.prototype, name);
        if (!dd) {
          Object.defineProperty(
            derivedCtor.prototype,
            name,
            Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
          );
        }
      } else if (name === 'init') {
        const bd = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
        inits.push({ self: null, value: bd.value });
      }
    });
  });

  superBaseCtors.forEach(baseCtor => {
    const myName = ((a: string) => a[0].toLowerCase() + a.slice(1))(
      baseCtor.prototype.constructor.name
    );
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name !== 'init' && name !== 'constructor') {
        const dd = Object.getOwnPropertyDescriptor(derivedCtor.prototype, name);
        const bd = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
        if (!dd) {
          Object.defineProperty(derivedCtor.prototype, name, {
            ...bd,
            value: function(...args: any[]) {
              return this[myName][name].call(this[myName], ...args);
            }
          });
        }
      } else if (name === 'init') {
        const bd = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
        inits.push({ self: myName, value: bd.value });
      }
    });
  });

  const names = Object.getOwnPropertyNames(derivedCtor.prototype);
  if (inits.length > 0 && names.findIndex(name => name === 'init')) {
    const dd = Object.getOwnPropertyDescriptor(derivedCtor.prototype, 'init');
    Object.defineProperty(derivedCtor.prototype, 'init', {
      ...dd,
      value: function(...args: any[]) {
        inits.map(({ self, value }) => value.call(self ? this[self] : this));
        return dd.value.call(this, ...args);
      }
    });
  }
}
