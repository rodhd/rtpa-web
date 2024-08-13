CREATE TABLE IF NOT EXISTS "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"location" "point",
	"website" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles_clubs" (
	"profiles_id" uuid,
	"club_id" integer,
	CONSTRAINT "profiles_clubs_profiles_id_club_id_pk" PRIMARY KEY("profiles_id","club_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles_clubs" ADD CONSTRAINT "profiles_clubs_profiles_id_profiles_id_fk" FOREIGN KEY ("profiles_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles_clubs" ADD CONSTRAINT "profiles_clubs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
