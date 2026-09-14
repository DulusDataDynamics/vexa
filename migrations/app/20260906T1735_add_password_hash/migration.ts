#!/usr/bin/env -S node

import type { Contract as End } from "../../snapshots/5704bfc97874a4df19277c714ec979da5624efedb3ccae8b74d356d3728e5aff/contract";
import endContractJson from "../../snapshots/5704bfc97874a4df19277c714ec979da5624efedb3ccae8b74d356d3728e5aff/contract.json" with { type: "json" };

import type { Contract as Start } from "../../snapshots/83d629725ed61c2b658e1c07b40b84feb1f2ae1844a6dbcc07065c1b27ad60e4/contract";
import startContractJson from "../../snapshots/83d629725ed61c2b658e1c07b40b84feb1f2ae1844a6dbcc07065c1b27ad60e4/contract.json" with { type: "json" };

import {
  Migration,
  MigrationCLI,
  col,
} from "@prisma/orm-postgres/migration";

import postgresAdapter from "@prisma/orm-postgres/adapter/runtime";
import { sql } from "@prisma/orm-postgres/builder/runtime";
import {
  createExecutionContext,
  createSqlExecutionStack,
} from "@prisma/orm-postgres/family-runtime";
import postgresTarget, {
  PostgresContractSerializer,
} from "@prisma/orm-postgres/target/runtime";

const endContract = new PostgresContractSerializer().deserializeContract(
  endContractJson
) as End;

const stack = createSqlExecutionStack({
  target: postgresTarget,
  adapter: postgresAdapter,
});

const db = sql<End>({
  context: createExecutionContext({ contract: endContract, stack }),
  rawCodecInferer: stack.adapter.rawCodecInferer,
});

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContractJson;
  override readonly endContractJson = endContractJson;

  override get operations() {
    return [
      this.addColumn({
        schema: "public",
        table: "user",
        column: col("passwordHash", "text", {
          codecRef: { codecId: "pg/text@1" },
        }),
      }),

      this.dataTransform(endContract, "backfill-user-passwordHash", {
        check: () =>
          db.public.user
            .select("id")
            .where((f, fns) => fns.eq(f.passwordHash, null))
            .limit(1),

        run: () =>
          db.public.user
            .update({
              passwordHash: "",
            })
            .where((f, fns) => fns.eq(f.passwordHash, null)),
      }),

      this.setNotNull({
        schema: "public",
        table: "user",
        column: "passwordHash",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);