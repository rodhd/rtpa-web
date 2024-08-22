import { ProfileForm } from "@/components/ProfileForm";
import { getClubs } from "@/lib/clubs/getClubs";
import { getProfile } from "@/lib/profiles/getProfile";
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

  const initialProfile = await getProfile();
  const clubs = await getClubs();
  
  return (
    <div className="flex w-full flex-col gap-10 items-center">
      <h1 className="text-3xl">Profile</h1>
      <ProfileForm firstName={initialProfile?.firstName ?? ''} lastName={initialProfile?.lastName ?? ''} clubIds={[]} clubs={clubs} />
    </div>
  )
}
