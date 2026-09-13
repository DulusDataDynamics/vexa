#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5704bfc97874a4df19277c714ec979da5624efedb3ccae8b74d356d3728e5aff/contract';
import endContract from '../../snapshots/5704bfc97874a4df19277c714ec979da5624efedb3ccae8b74d356d3728e5aff/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/83d629725ed61c2b658e1c07b40b84feb1f2ae1844a6dbcc07065c1b27ad60e4/contract';
import startContract from '../../snapshots/83d629725ed61c2b658e1c07b40b84feb1f2ae1844a6dbcc07065c1b27ad60e4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-passwordHash', {
        check: () => placeholder('backfill-user-passwordHash:check'),
        run: () => placeholder('backfill-user-passwordHash:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'passwordHash' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
