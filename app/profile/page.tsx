import { ProfileForm } from "@/components/ProfileForm";
import { getClubs } from "../actions";
import { getOrCreateProfile } from "../actions";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default async function Profile() {
  const { user } = useUser()

  if (!user) {
    return redirect("/");
  }

  let profile = await getOrCreateProfile();
  const clubs = await getClubs();
  
  return (
    <div className="flex w-full flex-col gap-10 items-center">
      <h1 className="text-3xl">Profile</h1>
      <ProfileForm firstName={profile?.firstName ?? ''} lastName={profile?.lastName ?? ''} clubIds={profile?.profilesToClubs.map(c => c.clubId) ?? []} clubs={clubs} />
    </div>
  )
}
