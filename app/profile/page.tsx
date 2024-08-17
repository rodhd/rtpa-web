"use client"

import { ProfileForm } from "@/components/ProfileForm";
import { getProfile } from "@/lib/profiles/getProfile";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useState } from "react";

export default async function Profile() {
  const supabase = createClient();
  const { data: { session} } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return redirect("/login");
  }

  const initialProfile = await getProfile();
  
  return (
    <div className="flex w-full flex-col gap-10 items-center">
      <h1 className="text-3xl">Profile</h1>
      <ProfileForm firstName={initialProfile?.firstName ?? ''} lastName={initialProfile?.lastName ?? ''} clubIds={[]} />
    </div>
  )
}