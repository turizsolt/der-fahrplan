import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Store } from '../../../src/structs/Interfaces/Store';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { WagonControlType } from '../../../src/structs/Actuals/Wagon/WagonControl/WagonControlType';
import { WagonConnectable } from '../../../src/structs/Actuals/Wagon/WagonConnectable';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);

describe('WagonConfig', () => {
  it('default config', () => {
    const wagon: Wagon = WagonFactory().init();

    expect(wagon.getMaxSpeed()).equals(3);
    expect(wagon.getAccelerateBy()).equals(0.25);

    expect(wagon.getControlType()).equals(WagonControlType.Locomotive);

    expect(wagon.getPassengerArrangement()).deep.equals({ rows: 7, seats: 3 }); // ???

    expect(wagon.getAppearanceId()).equals('wagon');
    expect(wagon.getLength()).equals(14);

    expect(wagon.getConnectable(WhichEnd.A)).equals(
      WagonConnectable.Connectable
    );
    expect(wagon.getConnectable(WhichEnd.B)).equals(
      WagonConnectable.Connectable
    );
  });

  it('set a config', () => {
    const wagon: Wagon = WagonFactory().init({
      maxSpeed: 5,
      accelerateBy: 0.5,
      controlType: WagonControlType.Nothing,
      passengerArrangement: { rows: 5, seats: 2 },
      appearanceId: 'utas',
      length: 15,
      connectable: {
        A: WagonConnectable.Nope,
        B: WagonConnectable.Nope
      }
    });

    expect(wagon.getMaxSpeed()).equals(5);
    expect(wagon.getAccelerateBy()).equals(0.5);

    expect(wagon.getControlType()).equals(WagonControlType.Nothing);

    expect(wagon.getPassengerArrangement()).deep.equals({ rows: 5, seats: 2 });

    expect(wagon.getAppearanceId()).equals('utas');
    expect(wagon.getLength()).equals(15);

    // expect(wagon.getConnectable(WhichEnd.A)).equals(WagonConnectable.Nope);
    // expect(wagon.getConnectable(WhichEnd.B)).equals(WagonConnectable.Nope);
  });
});
