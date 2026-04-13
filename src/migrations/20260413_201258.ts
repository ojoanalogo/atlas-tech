import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Clear existing text values so the varchar → timestamp cast succeeds
  await db.execute(sql`
    UPDATE "payload"."events" SET "start_time" = NULL, "end_time" = NULL;
    UPDATE "payload"."_events_v" SET "version_start_time" = NULL, "version_end_time" = NULL;
  `)
  await db.execute(sql`
    ALTER TABLE "payload"."events"
      ALTER COLUMN "start_time" SET DATA TYPE timestamp(3) with time zone USING "start_time"::timestamp(3) with time zone,
      ALTER COLUMN "end_time" SET DATA TYPE timestamp(3) with time zone USING "end_time"::timestamp(3) with time zone;
    ALTER TABLE "payload"."_events_v"
      ALTER COLUMN "version_start_time" SET DATA TYPE timestamp(3) with time zone USING "version_start_time"::timestamp(3) with time zone,
      ALTER COLUMN "version_end_time" SET DATA TYPE timestamp(3) with time zone USING "version_end_time"::timestamp(3) with time zone;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."events" ALTER COLUMN "start_time" SET DATA TYPE varchar;
  ALTER TABLE "payload"."events" ALTER COLUMN "end_time" SET DATA TYPE varchar;
  ALTER TABLE "payload"."_events_v" ALTER COLUMN "version_start_time" SET DATA TYPE varchar;
  ALTER TABLE "payload"."_events_v" ALTER COLUMN "version_end_time" SET DATA TYPE varchar;`)
}
