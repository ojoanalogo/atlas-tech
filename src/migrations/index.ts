import * as migration_20260401_005656 from './20260401_005656';
import * as migration_20260402_051032 from './20260402_051032';
import * as migration_20260402_052120 from './20260402_052120';

export const migrations = [
  {
    up: migration_20260401_005656.up,
    down: migration_20260401_005656.down,
    name: '20260401_005656',
  },
  {
    up: migration_20260402_051032.up,
    down: migration_20260402_051032.down,
    name: '20260402_051032',
  },
  {
    up: migration_20260402_052120.up,
    down: migration_20260402_052120.down,
    name: '20260402_052120'
  },
];
