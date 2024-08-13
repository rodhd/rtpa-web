DO $$ BEGIN
 CREATE TYPE "public"."profileClubRole" AS ENUM('member', 'manager');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "profiles_clubs" ADD COLUMN "role" "profileClubRole";