import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Store } from '../../../src/structs/Interfaces/Store';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { getPredefinedWagonConfig } from '../../../src/structs/Actuals/Wagon/ActualWagonConfigs';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
chai.use(chaiAlmost());

export const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);

export const A = WhichEnd.A;
export const B = WhichEnd.B;

export enum W {
  Loco = 'locomotive',
  Pass = 'passenger',
  Cont = 'controlCar',
  Comb = 'combined'
}

export function buildTrain(...wagonStrings: string[]): Wagon[] {
  const returnedWagons: Wagon[] = [];
  for (let wagonString of wagonStrings) {
    returnedWagons.push(
      WagonFactory().init(getPredefinedWagonConfig(wagonString))
    );
  }
  for (let i = 1; i < returnedWagons.length; i++) {
    returnedWagons[i - 1].getB().connect(returnedWagons[i].getA());
  }

  return returnedWagons;
}

export function expectTrainSides(
  wagons: Wagon[],
  sides: WhichEnd[],
  selected?: Wagon
) {
  for (let i = 0; i < wagons.length; i++) {
    expect(wagons[i].getSelectedSide()).equals(
      sides[i],
      'offset ' + i.toString()
    );
  }
  expectTrainSelected(selected);
}

export function expectTrainSide(
  wagon: Wagon,
  side: WhichEnd,
  selected?: Wagon
) {
  expect(wagon.getSelectedSide()).equals(side);
  expectTrainSelected(selected);
}

export function expectTrainSelected(selected?: Wagon) {
  if (selected !== undefined) {
    if (selected) {
      expect(store.getSelected().getId()).equals(selected.getId());
    } else {
      expect(store.getSelected()).equals(null);
    }
  }
}
