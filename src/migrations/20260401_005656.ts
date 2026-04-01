import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_users_role" AS ENUM('admin', 'moderator', 'editor');
  CREATE TYPE "payload"."enum_entries_entry_type" AS ENUM('startup', 'community', 'business', 'consultory', 'research-center', 'person');
  CREATE TYPE "payload"."enum_entries_city" AS ENUM('global', 'ahome', 'angostura', 'badiraguato', 'choix', 'concordia', 'cosala', 'culiacan', 'el-fuerte', 'elota', 'escuinapa', 'guasave', 'mazatlan', 'mocorito', 'navolato', 'rosario', 'salvador-alvarado', 'san-ignacio', 'sinaloa-de-leyva');
  CREATE TYPE "payload"."enum_entries_stage" AS ENUM('Idea', 'Bootstrap', 'Pre-seed', 'Seed', 'Serie A', 'Serie B+', 'Establecida');
  CREATE TYPE "payload"."enum_entries_team_size" AS ENUM('1-5', '6-15', '16-50', '51-200', '200+');
  CREATE TYPE "payload"."enum_entries_sector" AS ENUM('Desarrollo Web', 'Desarrollo Mobile', 'SaaS', 'Fintech', 'Edtech', 'HealthTech', 'AgriTech', 'E-commerce', 'IA / Machine Learning', 'Ciberseguridad', 'IoT', 'MarTech', 'LegalTech', 'Logística', 'Gaming', 'Blockchain / Web3', 'Cloud / Infraestructura', 'Data & Analytics', 'Consultoría IT', 'Automatización', 'Otro');
  CREATE TYPE "payload"."enum_entries_business_model" AS ENUM('B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'Freemium', 'Open Source', 'Otro');
  CREATE TYPE "payload"."enum_entries_meetup_frequency" AS ENUM('Permanente (online)', 'Semanal', 'Quincenal', 'Mensual', 'Trimestral', 'Por evento', 'Otro');
  CREATE TYPE "payload"."enum_entries_platform" AS ENUM('Discord', 'Telegram', 'Slack', 'WhatsApp', 'Presencial', 'Otro');
  CREATE TYPE "payload"."enum_entries_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__entries_v_version_entry_type" AS ENUM('startup', 'community', 'business', 'consultory', 'research-center', 'person');
  CREATE TYPE "payload"."enum__entries_v_version_city" AS ENUM('global', 'ahome', 'angostura', 'badiraguato', 'choix', 'concordia', 'cosala', 'culiacan', 'el-fuerte', 'elota', 'escuinapa', 'guasave', 'mazatlan', 'mocorito', 'navolato', 'rosario', 'salvador-alvarado', 'san-ignacio', 'sinaloa-de-leyva');
  CREATE TYPE "payload"."enum__entries_v_version_stage" AS ENUM('Idea', 'Bootstrap', 'Pre-seed', 'Seed', 'Serie A', 'Serie B+', 'Establecida');
  CREATE TYPE "payload"."enum__entries_v_version_team_size" AS ENUM('1-5', '6-15', '16-50', '51-200', '200+');
  CREATE TYPE "payload"."enum__entries_v_version_sector" AS ENUM('Desarrollo Web', 'Desarrollo Mobile', 'SaaS', 'Fintech', 'Edtech', 'HealthTech', 'AgriTech', 'E-commerce', 'IA / Machine Learning', 'Ciberseguridad', 'IoT', 'MarTech', 'LegalTech', 'Logística', 'Gaming', 'Blockchain / Web3', 'Cloud / Infraestructura', 'Data & Analytics', 'Consultoría IT', 'Automatización', 'Otro');
  CREATE TYPE "payload"."enum__entries_v_version_business_model" AS ENUM('B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'Freemium', 'Open Source', 'Otro');
  CREATE TYPE "payload"."enum__entries_v_version_meetup_frequency" AS ENUM('Permanente (online)', 'Semanal', 'Quincenal', 'Mensual', 'Trimestral', 'Por evento', 'Otro');
  CREATE TYPE "payload"."enum__entries_v_version_platform" AS ENUM('Discord', 'Telegram', 'Slack', 'WhatsApp', 'Presencial', 'Otro');
  CREATE TYPE "payload"."enum__entries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_jobs_type" AS ENUM('full-time', 'part-time', 'contract', 'freelance', 'volunteer');
  CREATE TYPE "payload"."enum_jobs_modality" AS ENUM('remote', 'in-person', 'hybrid');
  CREATE TYPE "payload"."enum_jobs_city" AS ENUM('global', 'ahome', 'angostura', 'badiraguato', 'choix', 'concordia', 'cosala', 'culiacan', 'el-fuerte', 'elota', 'escuinapa', 'guasave', 'mazatlan', 'mocorito', 'navolato', 'rosario', 'salvador-alvarado', 'san-ignacio', 'sinaloa-de-leyva');
  CREATE TYPE "payload"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__jobs_v_version_type" AS ENUM('full-time', 'part-time', 'contract', 'freelance', 'volunteer');
  CREATE TYPE "payload"."enum__jobs_v_version_modality" AS ENUM('remote', 'in-person', 'hybrid');
  CREATE TYPE "payload"."enum__jobs_v_version_city" AS ENUM('global', 'ahome', 'angostura', 'badiraguato', 'choix', 'concordia', 'cosala', 'culiacan', 'el-fuerte', 'elota', 'escuinapa', 'guasave', 'mazatlan', 'mocorito', 'navolato', 'rosario', 'salvador-alvarado', 'san-ignacio', 'sinaloa-de-leyva');
  CREATE TYPE "payload"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_events_modality" AS ENUM('in-person', 'online', 'hybrid');
  CREATE TYPE "payload"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__events_v_version_modality" AS ENUM('in-person', 'online', 'hybrid');
  CREATE TYPE "payload"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_cover_url" varchar,
  	"sizes_cover_width" numeric,
  	"sizes_cover_height" numeric,
  	"sizes_cover_mime_type" varchar,
  	"sizes_cover_filesize" numeric,
  	"sizes_cover_filename" varchar
  );
  
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "payload"."enum_users_role" DEFAULT 'editor' NOT NULL,
  	"display_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."entries_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "payload"."entries_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "payload"."entries_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"technology" varchar
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
  
  CREATE TABLE "payload"."entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entry_type" "payload"."enum_entries_entry_type",
  	"name" varchar,
  	"slug" varchar,
  	"tagline" varchar,
  	"city" "payload"."enum_entries_city",
  	"state" varchar DEFAULT 'Sinaloa',
  	"country" varchar DEFAULT 'México',
  	"logo_id" integer,
  	"cover_image_id" integer,
  	"verified" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"website" varchar,
  	"x" varchar,
  	"instagram" varchar,
  	"linkedin" varchar,
  	"github" varchar,
  	"youtube" varchar,
  	"publish_date" timestamp(3) with time zone,
  	"owner" varchar,
  	"moderation_note" varchar,
  	"body" jsonb,
  	"founded_year" numeric,
  	"stage" "payload"."enum_entries_stage",
  	"team_size" "payload"."enum_entries_team_size",
  	"sector" "payload"."enum_entries_sector",
  	"hiring" boolean DEFAULT false,
  	"hiring_url" varchar,
  	"business_model" "payload"."enum_entries_business_model",
  	"member_count" numeric,
  	"meetup_frequency" "payload"."enum_entries_meetup_frequency",
  	"discord" varchar,
  	"telegram" varchar,
  	"platform" "payload"."enum_entries_platform",
  	"role" varchar,
  	"company" varchar,
  	"available_for_hire" boolean DEFAULT false,
  	"available_for_mentoring" boolean DEFAULT false,
  	"email" varchar,
  	"portfolio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_entries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_entries_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_entries_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_entries_v_version_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"technology" varchar,
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
  
  CREATE TABLE "payload"."_entries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_entry_type" "payload"."enum__entries_v_version_entry_type",
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_tagline" varchar,
  	"version_city" "payload"."enum__entries_v_version_city",
  	"version_state" varchar DEFAULT 'Sinaloa',
  	"version_country" varchar DEFAULT 'México',
  	"version_logo_id" integer,
  	"version_cover_image_id" integer,
  	"version_verified" boolean DEFAULT false,
  	"version_featured" boolean DEFAULT false,
  	"version_website" varchar,
  	"version_x" varchar,
  	"version_instagram" varchar,
  	"version_linkedin" varchar,
  	"version_github" varchar,
  	"version_youtube" varchar,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_owner" varchar,
  	"version_moderation_note" varchar,
  	"version_body" jsonb,
  	"version_founded_year" numeric,
  	"version_stage" "payload"."enum__entries_v_version_stage",
  	"version_team_size" "payload"."enum__entries_v_version_team_size",
  	"version_sector" "payload"."enum__entries_v_version_sector",
  	"version_hiring" boolean DEFAULT false,
  	"version_hiring_url" varchar,
  	"version_business_model" "payload"."enum__entries_v_version_business_model",
  	"version_member_count" numeric,
  	"version_meetup_frequency" "payload"."enum__entries_v_version_meetup_frequency",
  	"version_discord" varchar,
  	"version_telegram" varchar,
  	"version_platform" "payload"."enum__entries_v_version_platform",
  	"version_role" varchar,
  	"version_company" varchar,
  	"version_available_for_hire" boolean DEFAULT false,
  	"version_available_for_mentoring" boolean DEFAULT false,
  	"version_email" varchar,
  	"version_portfolio" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__entries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."news_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "payload"."news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"body" jsonb,
  	"author_id" integer,
  	"publish_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_news_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_body" jsonb,
  	"version_author_id" integer,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."jobs_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "payload"."jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" jsonb,
  	"type" "payload"."enum_jobs_type",
  	"modality" "payload"."enum_jobs_modality",
  	"city" "payload"."enum_jobs_city",
  	"compensation" varchar,
  	"contact_url" varchar,
  	"posted_by" varchar,
  	"moderation_note" varchar,
  	"entry_id" integer,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_jobs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_jobs_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" jsonb,
  	"version_type" "payload"."enum__jobs_v_version_type",
  	"version_modality" "payload"."enum__jobs_v_version_modality",
  	"version_city" "payload"."enum__jobs_v_version_city",
  	"version_compensation" varchar,
  	"version_contact_url" varchar,
  	"version_posted_by" varchar,
  	"version_moderation_note" varchar,
  	"version_entry_id" integer,
  	"version_expires_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"organizer" varchar,
  	"description" jsonb,
  	"date" timestamp(3) with time zone,
  	"start_time" varchar,
  	"end_time" varchar,
  	"location" varchar,
  	"maps_url" varchar,
  	"modality" "payload"."enum_events_modality" DEFAULT 'in-person',
  	"meet_link" varchar,
  	"url" varchar,
  	"register_url" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_organizer" varchar,
  	"version_description" jsonb,
  	"version_date" timestamp(3) with time zone,
  	"version_start_time" varchar,
  	"version_end_time" varchar,
  	"version_location" varchar,
  	"version_maps_url" varchar,
  	"version_modality" "payload"."enum__events_v_version_modality" DEFAULT 'in-person',
  	"version_meet_link" varchar,
  	"version_url" varchar,
  	"version_register_url" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"users_id" integer,
  	"entries_id" integer,
  	"news_id" integer,
  	"jobs_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries_tags" ADD CONSTRAINT "entries_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries_services" ADD CONSTRAINT "entries_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries_technologies" ADD CONSTRAINT "entries_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries_focus_areas" ADD CONSTRAINT "entries_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries_skills" ADD CONSTRAINT "entries_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."entries" ADD CONSTRAINT "entries_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."entries" ADD CONSTRAINT "entries_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_tags" ADD CONSTRAINT "_entries_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_services" ADD CONSTRAINT "_entries_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_technologies" ADD CONSTRAINT "_entries_v_version_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_focus_areas" ADD CONSTRAINT "_entries_v_version_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v_version_skills" ADD CONSTRAINT "_entries_v_version_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v" ADD CONSTRAINT "_entries_v_parent_id_entries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v" ADD CONSTRAINT "_entries_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_entries_v" ADD CONSTRAINT "_entries_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."news_tags" ADD CONSTRAINT "news_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."news" ADD CONSTRAINT "news_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."news" ADD CONSTRAINT "news_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v_version_tags" ADD CONSTRAINT "_news_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."jobs_tags" ADD CONSTRAINT "jobs_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."jobs" ADD CONSTRAINT "jobs_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "payload"."entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_jobs_v_version_tags" ADD CONSTRAINT "_jobs_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_jobs_v" ADD CONSTRAINT "_jobs_v_version_entry_id_entries_id_fk" FOREIGN KEY ("version_entry_id") REFERENCES "payload"."entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entries_fk" FOREIGN KEY ("entries_id") REFERENCES "payload"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "payload"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "payload"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_cover_sizes_cover_filename_idx" ON "payload"."media" USING btree ("sizes_cover_filename");
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "entries_tags_order_idx" ON "payload"."entries_tags" USING btree ("_order");
  CREATE INDEX "entries_tags_parent_id_idx" ON "payload"."entries_tags" USING btree ("_parent_id");
  CREATE INDEX "entries_services_order_idx" ON "payload"."entries_services" USING btree ("_order");
  CREATE INDEX "entries_services_parent_id_idx" ON "payload"."entries_services" USING btree ("_parent_id");
  CREATE INDEX "entries_technologies_order_idx" ON "payload"."entries_technologies" USING btree ("_order");
  CREATE INDEX "entries_technologies_parent_id_idx" ON "payload"."entries_technologies" USING btree ("_parent_id");
  CREATE INDEX "entries_focus_areas_order_idx" ON "payload"."entries_focus_areas" USING btree ("_order");
  CREATE INDEX "entries_focus_areas_parent_id_idx" ON "payload"."entries_focus_areas" USING btree ("_parent_id");
  CREATE INDEX "entries_skills_order_idx" ON "payload"."entries_skills" USING btree ("_order");
  CREATE INDEX "entries_skills_parent_id_idx" ON "payload"."entries_skills" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "entries_slug_idx" ON "payload"."entries" USING btree ("slug");
  CREATE INDEX "entries_logo_idx" ON "payload"."entries" USING btree ("logo_id");
  CREATE INDEX "entries_cover_image_idx" ON "payload"."entries" USING btree ("cover_image_id");
  CREATE INDEX "entries_owner_idx" ON "payload"."entries" USING btree ("owner");
  CREATE INDEX "entries_updated_at_idx" ON "payload"."entries" USING btree ("updated_at");
  CREATE INDEX "entries_created_at_idx" ON "payload"."entries" USING btree ("created_at");
  CREATE INDEX "entries__status_idx" ON "payload"."entries" USING btree ("_status");
  CREATE INDEX "_entries_v_version_tags_order_idx" ON "payload"."_entries_v_version_tags" USING btree ("_order");
  CREATE INDEX "_entries_v_version_tags_parent_id_idx" ON "payload"."_entries_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_version_services_order_idx" ON "payload"."_entries_v_version_services" USING btree ("_order");
  CREATE INDEX "_entries_v_version_services_parent_id_idx" ON "payload"."_entries_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_version_technologies_order_idx" ON "payload"."_entries_v_version_technologies" USING btree ("_order");
  CREATE INDEX "_entries_v_version_technologies_parent_id_idx" ON "payload"."_entries_v_version_technologies" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_version_focus_areas_order_idx" ON "payload"."_entries_v_version_focus_areas" USING btree ("_order");
  CREATE INDEX "_entries_v_version_focus_areas_parent_id_idx" ON "payload"."_entries_v_version_focus_areas" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_version_skills_order_idx" ON "payload"."_entries_v_version_skills" USING btree ("_order");
  CREATE INDEX "_entries_v_version_skills_parent_id_idx" ON "payload"."_entries_v_version_skills" USING btree ("_parent_id");
  CREATE INDEX "_entries_v_parent_idx" ON "payload"."_entries_v" USING btree ("parent_id");
  CREATE INDEX "_entries_v_version_version_slug_idx" ON "payload"."_entries_v" USING btree ("version_slug");
  CREATE INDEX "_entries_v_version_version_logo_idx" ON "payload"."_entries_v" USING btree ("version_logo_id");
  CREATE INDEX "_entries_v_version_version_cover_image_idx" ON "payload"."_entries_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_entries_v_version_version_owner_idx" ON "payload"."_entries_v" USING btree ("version_owner");
  CREATE INDEX "_entries_v_version_version_updated_at_idx" ON "payload"."_entries_v" USING btree ("version_updated_at");
  CREATE INDEX "_entries_v_version_version_created_at_idx" ON "payload"."_entries_v" USING btree ("version_created_at");
  CREATE INDEX "_entries_v_version_version__status_idx" ON "payload"."_entries_v" USING btree ("version__status");
  CREATE INDEX "_entries_v_created_at_idx" ON "payload"."_entries_v" USING btree ("created_at");
  CREATE INDEX "_entries_v_updated_at_idx" ON "payload"."_entries_v" USING btree ("updated_at");
  CREATE INDEX "_entries_v_latest_idx" ON "payload"."_entries_v" USING btree ("latest");
  CREATE INDEX "news_tags_order_idx" ON "payload"."news_tags" USING btree ("_order");
  CREATE INDEX "news_tags_parent_id_idx" ON "payload"."news_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "payload"."news" USING btree ("slug");
  CREATE INDEX "news_cover_image_idx" ON "payload"."news" USING btree ("cover_image_id");
  CREATE INDEX "news_author_idx" ON "payload"."news" USING btree ("author_id");
  CREATE INDEX "news_updated_at_idx" ON "payload"."news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "payload"."news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "payload"."news" USING btree ("_status");
  CREATE INDEX "_news_v_version_tags_order_idx" ON "payload"."_news_v_version_tags" USING btree ("_order");
  CREATE INDEX "_news_v_version_tags_parent_id_idx" ON "payload"."_news_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "payload"."_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "payload"."_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_cover_image_idx" ON "payload"."_news_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_news_v_version_version_author_idx" ON "payload"."_news_v" USING btree ("version_author_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "payload"."_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "payload"."_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "payload"."_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "payload"."_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "payload"."_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "payload"."_news_v" USING btree ("latest");
  CREATE INDEX "jobs_tags_order_idx" ON "payload"."jobs_tags" USING btree ("_order");
  CREATE INDEX "jobs_tags_parent_id_idx" ON "payload"."jobs_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "payload"."jobs" USING btree ("slug");
  CREATE INDEX "jobs_posted_by_idx" ON "payload"."jobs" USING btree ("posted_by");
  CREATE INDEX "jobs_entry_idx" ON "payload"."jobs" USING btree ("entry_id");
  CREATE INDEX "jobs_expires_at_idx" ON "payload"."jobs" USING btree ("expires_at");
  CREATE INDEX "jobs_updated_at_idx" ON "payload"."jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "payload"."jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "payload"."jobs" USING btree ("_status");
  CREATE INDEX "_jobs_v_version_tags_order_idx" ON "payload"."_jobs_v_version_tags" USING btree ("_order");
  CREATE INDEX "_jobs_v_version_tags_parent_id_idx" ON "payload"."_jobs_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_parent_idx" ON "payload"."_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "payload"."_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_version_posted_by_idx" ON "payload"."_jobs_v" USING btree ("version_posted_by");
  CREATE INDEX "_jobs_v_version_version_entry_idx" ON "payload"."_jobs_v" USING btree ("version_entry_id");
  CREATE INDEX "_jobs_v_version_version_expires_at_idx" ON "payload"."_jobs_v" USING btree ("version_expires_at");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "payload"."_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "payload"."_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "payload"."_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "payload"."_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "payload"."_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_latest_idx" ON "payload"."_jobs_v" USING btree ("latest");
  CREATE INDEX "events_image_idx" ON "payload"."events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "payload"."events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "payload"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "payload"."_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "payload"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "payload"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "payload"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "payload"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "payload"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "payload"."_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_entries_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("entries_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."entries_tags" CASCADE;
  DROP TABLE "payload"."entries_services" CASCADE;
  DROP TABLE "payload"."entries_technologies" CASCADE;
  DROP TABLE "payload"."entries_focus_areas" CASCADE;
  DROP TABLE "payload"."entries_skills" CASCADE;
  DROP TABLE "payload"."entries" CASCADE;
  DROP TABLE "payload"."_entries_v_version_tags" CASCADE;
  DROP TABLE "payload"."_entries_v_version_services" CASCADE;
  DROP TABLE "payload"."_entries_v_version_technologies" CASCADE;
  DROP TABLE "payload"."_entries_v_version_focus_areas" CASCADE;
  DROP TABLE "payload"."_entries_v_version_skills" CASCADE;
  DROP TABLE "payload"."_entries_v" CASCADE;
  DROP TABLE "payload"."news_tags" CASCADE;
  DROP TABLE "payload"."news" CASCADE;
  DROP TABLE "payload"."_news_v_version_tags" CASCADE;
  DROP TABLE "payload"."_news_v" CASCADE;
  DROP TABLE "payload"."jobs_tags" CASCADE;
  DROP TABLE "payload"."jobs" CASCADE;
  DROP TABLE "payload"."_jobs_v_version_tags" CASCADE;
  DROP TABLE "payload"."_jobs_v" CASCADE;
  DROP TABLE "payload"."events" CASCADE;
  DROP TABLE "payload"."_events_v" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TYPE "payload"."enum_users_role";
  DROP TYPE "payload"."enum_entries_entry_type";
  DROP TYPE "payload"."enum_entries_city";
  DROP TYPE "payload"."enum_entries_stage";
  DROP TYPE "payload"."enum_entries_team_size";
  DROP TYPE "payload"."enum_entries_sector";
  DROP TYPE "payload"."enum_entries_business_model";
  DROP TYPE "payload"."enum_entries_meetup_frequency";
  DROP TYPE "payload"."enum_entries_platform";
  DROP TYPE "payload"."enum_entries_status";
  DROP TYPE "payload"."enum__entries_v_version_entry_type";
  DROP TYPE "payload"."enum__entries_v_version_city";
  DROP TYPE "payload"."enum__entries_v_version_stage";
  DROP TYPE "payload"."enum__entries_v_version_team_size";
  DROP TYPE "payload"."enum__entries_v_version_sector";
  DROP TYPE "payload"."enum__entries_v_version_business_model";
  DROP TYPE "payload"."enum__entries_v_version_meetup_frequency";
  DROP TYPE "payload"."enum__entries_v_version_platform";
  DROP TYPE "payload"."enum__entries_v_version_status";
  DROP TYPE "payload"."enum_news_status";
  DROP TYPE "payload"."enum__news_v_version_status";
  DROP TYPE "payload"."enum_jobs_type";
  DROP TYPE "payload"."enum_jobs_modality";
  DROP TYPE "payload"."enum_jobs_city";
  DROP TYPE "payload"."enum_jobs_status";
  DROP TYPE "payload"."enum__jobs_v_version_type";
  DROP TYPE "payload"."enum__jobs_v_version_modality";
  DROP TYPE "payload"."enum__jobs_v_version_city";
  DROP TYPE "payload"."enum__jobs_v_version_status";
  DROP TYPE "payload"."enum_events_modality";
  DROP TYPE "payload"."enum_events_status";
  DROP TYPE "payload"."enum__events_v_version_modality";
  DROP TYPE "payload"."enum__events_v_version_status";`)
}
