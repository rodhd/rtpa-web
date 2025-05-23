CREATE TYPE "public"."courtLocation" AS ENUM('outdoor', 'indoor');--> statement-breakpoint
CREATE TYPE "public"."courtSurface" AS ENUM('hard', 'clay', 'grass', 'carpet');--> statement-breakpoint
CREATE TYPE "public"."courtType" AS ENUM('tennis', 'paddel');--> statement-breakpoint
CREATE TYPE "public"."profileClubRole" AS ENUM('member', 'manager');--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"website" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "courts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "courtType" NOT NULL,
	"surface" "courtSurface" NOT NULL,
	"location" "courtLocation" NOT NULL,
	"club_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256),
	CONSTRAINT "profiles_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "profiles_clubs" (
	"profiles_id" varchar NOT NULL,
	"club_id" integer NOT NULL,
	"role" "profileClubRole" NOT NULL,
	CONSTRAINT "profiles_clubs_profiles_id_club_id_pk" PRIMARY KEY("profiles_id","club_id")
);
--> statement-breakpoint
ALTER TABLE "courts" ADD CONSTRAINT "courts_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles_clubs" ADD CONSTRAINT "profiles_clubs_profiles_id_profiles_id_fk" FOREIGN KEY ("profiles_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles_clubs" ADD CONSTRAINT "profiles_clubs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;