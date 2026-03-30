CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"company" text,
	"email" text,
	"phone" text,
	"website" text,
	"photo" text,
	"linkedin" text,
	"x" text,
	"github" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
