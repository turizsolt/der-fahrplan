export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  const inits = [];
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name !== 'init' && name !== 'constructor') {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
        );
      } else if (name === 'init') {
        const bd = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
        inits.push(bd.value);
      }
    });
  });

  const names = Object.getOwnPropertyNames(derivedCtor.prototype);
  if (inits.length > 0 && names.findIndex(name => name === 'init')) {
    const dd = Object.getOwnPropertyDescriptor(derivedCtor.prototype, 'init');
    Object.defineProperty(derivedCtor.prototype, 'init', {
      ...dd,
      value: function(...args: any[]) {
        inits.map(initFn => initFn.call(this));
        return dd.value.call(this, ...args);
      }
    });
  }
}
