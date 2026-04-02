import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."entries_services" CASCADE;
  DROP TABLE "payload"."entries_focus_areas" CASCADE;
  DROP TABLE "payload"."entries_skills" CASCADE;
  DROP TABLE "payload"."_entries_v_version_services" CASCADE;
  DROP TABLE "payload"."_entries_v_version_focus_areas" CASCADE;
  DROP TABLE "payload"."_entries_v_version_skills" CASCADE;
  ALTER TABLE "payload"."entries" DROP COLUMN "hiring";
  ALTER TABLE "payload"."entries" DROP COLUMN "platform";
  ALTER TABLE "payload"."_entries_v" DROP COLUMN "version_hiring";
  ALTER TABLE "payload"."_entries_v" DROP COLUMN "version_platform";
  DROP TYPE "payload"."enum_entries_platform";
  DROP TYPE "payload"."enum__entries_v_version_platform";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_entries_platform" AS ENUM('Discord', 'Telegram', 'Slack', 'WhatsApp', 'Presencial', 'Otro');
  CREATE TYPE "payload"."enum__entries_v_version_platform" AS ENUM('Discord', 'Telegram', 'Slack', 'WhatsApp', 'Presencial', 'Otro');
  CREATE TABLE "payload"."entries_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "payload"."entries_focus_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar
  );
  
  CREATE TABLE "payload"."entries_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skill" varchar
  );
  
  CREATE TABLE "payload"."_entries_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_entries_v_version_focus_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"area" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_entries_v_version_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"skill" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "payload"."entries" ADD COLUMN "hiring" boolean DEFAULT false;
  ALTER TABLE "payload"."entries" ADD COLUMN "platform" "payload"."enum_entries_platform";
  ALTER TABLE "payload"."_entries_v" ADD COLUMN "version_hiring" boolean DEFAULT false;
  ALTER TABLE "payload"."_entries_v" ADD COLUMN "version_platform" "payload"."enum__entries_v_version_platform";
  ALTER TABLE "payload"."entries_services" ADD CONSTRAINT "entries_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries_focus_areas" ADD CONSTRAINT "entries_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries_skills" ADD CONSTRAINT "entries_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_services" ADD CONSTRAINT "_entries_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_focus_areas" ADD CONSTRAINT "_entries_v_version_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_skills" ADD CONSTRAINT "_entries_v_version_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "entries_services_order_idx" ON "payload"."entries_services" USING btree ("_order");
  CREATE INDEX "entries_services_parent_id_idx" ON "payload"."entries_services" USING btree ("_parent_id");
  CREATE INDEX "entries_focus_areas_order_idx" ON "payload"."entries_focus_areas" USING btree ("_order");
  CREATE INDEX "entries_focus_areas_parent_id_idx" ON "payload"."entries_focus_areas" USING btree ("_parent_id");
  CREATE INDEX "entries_skills_order_idx" ON "payload"."entries_skills" USING btree ("_order");
  CREATE INDEX "entries_skills_parent_id_idx" ON "payload"."entries_skills" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_version_services_order_idx" ON "payload"."_entries_v_version_services" USING btree ("_order");
  CREATE INDEX "_entries_v_version_services_parent_id_idx" ON "payload"."_entries_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_version_focus_areas_order_idx" ON "payload"."_entries_v_version_focus_areas" USING btree ("_order");
  CREATE INDEX "_entries_v_version_focus_areas_parent_id_idx" ON "payload"."_entries_v_version_focus_areas" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_version_skills_order_idx" ON "payload"."_entries_v_version_skills" USING btree ("_order");
  CREATE INDEX "_entries_v_version_skills_parent_id_idx" ON "payload"."_entries_v_version_skills" USING btree ("_parent_id");`)
}
