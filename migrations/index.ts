import * as migration_20251216_124046_initial from './20251216_124046_initial';

export const migrations = [
  {
    up: migration_20251216_124046_initial.up,
    down: migration_20251216_124046_initial.down,
    name: '20251216_124046_initial'
  },
];
