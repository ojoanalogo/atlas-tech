import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."entries" ALTER COLUMN "body" SET DATA TYPE varchar;
  ALTER TABLE "payload"."_entries_v" ALTER COLUMN "version_body" SET DATA TYPE varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."entries" ALTER COLUMN "body" SET DATA TYPE jsonb;
  ALTER TABLE "payload"."_entries_v" ALTER COLUMN "version_body" SET DATA TYPE jsonb;`)
}
