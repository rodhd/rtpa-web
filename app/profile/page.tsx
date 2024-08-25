import { ProfileForm } from "@/components/ProfileForm";
import { getClubs } from "@/app/actions/clubs/getClubs";
import { getProfile } from "@/app/actions/profiles/getProfile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Profile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  let profile = await getProfile();
  const clubs = await getClubs();
  
  return (
    <div className="flex w-full flex-col gap-10 items-center">
      <h1 className="text-3xl">Profile</h1>
      <ProfileForm firstName={profile?.firstName ?? ''} lastName={profile?.lastName ?? ''} clubIds={profile?.profilesToClubs.map(c => c.clubId) ?? []} clubs={clubs} />
    </div>
  )
}
