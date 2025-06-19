CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"court_id" integer NOT NULL,
	"profile_id" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "courts" DROP CONSTRAINT "courts_club_id_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles_clubs" DROP CONSTRAINT "profiles_clubs_profiles_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles_clubs" DROP CONSTRAINT "profiles_clubs_club_id_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "courts" ADD COLUMN "active" boolean DEFAULT true NOT NULL;