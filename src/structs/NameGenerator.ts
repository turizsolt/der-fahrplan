const names = [
  'Aelcoast',
  //   'Ashvale',
  //   'Ashview',
  'Belwald',
  //   'Blueoak',
  //   'Brightbay',
  //   'Brightpine',
  //   'Butteracre',
  //   'Butterice',
  'Clearcrest',
  //   'Clearelf',
  //   'Clearfield',
  //   'Corcastle',
  //   'Corkeep',
  //   'Cormeadow',
  //   'Crystalpine',
  //   'Crystalwell',
  'Deepsage',
  //   'Dracbush',
  'Edgemeadow',
  //   'Esterton',
  'Fairdeer',
  //   'Falconhurst',
  //   'Fallgate',
  //   'Fallwitch',
  //   'Fogtown',
  //   'Foxwall',
  //   'Freylea',
  'Greenlight',
  'Hedgebeach',
  'Icecliff',
  //   'Icesilver',
  //   'Ironburn',
  'Jangate',
  //   'Janmount',
  'Kerwood', // own
  'Landhedge',
  //   'Lightbush',
  'Marblemoor',
  //   'Meadowcastle',
  //   'Merriden',
  //   'Morley',
  'Northhurst',
  'Oakbarrow',
  //   'Ormere',
  'Pondley', // own
  'Quinnhill', // own
  'Rayville',
  'Sagepond',
  //   'Shadowville',
  //   'Shorecoast',
  //   'Shorehollow',
  //   'Silverfalcon',
  //   'Snowfort',
  //   'Snowley',
  //   'Snowloch',
  //   'Starrycliff',
  //   'Stonelake',
  //   'Strongford',
  'Treefort', // own
  'Urley', // own
  'Violetham',
  //   'Wellpond',
  //   'Wellshade',
  //   'Westerhall',
  //   'Westhill',
  'Westmeadow',
  //   'Whiteshore',
  //   'Wildewater',
  //   'Wyvernbank',
  //   'Wyvernbridge',
  'Xamaloo', // own
  'Yvorywater', // own
  'Zilklake' // own
]; // via https://www.namegenerator2.com/town-name-generator.php

let i = 0;
names.sort((a, b) => Math.random() - 0.5);

export class NameGenerator {
  static next(): string {
    return names[i++];
  }
}
