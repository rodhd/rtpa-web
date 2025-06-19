import { Profile, ProfileToClub } from "@/lib/schema";

export type ProfileWithClubs = Profile & {
    profilesToClubs: ProfileToClub[]
}; 