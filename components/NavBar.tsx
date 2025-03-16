import Link from "next/link";
import AuthButton from "./AuthButton";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { IsManager } from "@/app/actions";

export default async function NavBar() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const managerClubId = await IsManager();

  return (<div className="w-full flex justify-between items-center p-3 text-sm">
    <Button variant="link" asChild>
      <Link href="/">Home</Link>
    </Button>
    <div className="flex flex-row justify-between items-center gap-4">
      {!!managerClubId && (
        <Button variant="secondary" asChild>
          <Link href={`/club/${managerClubId}`}>Club</Link>
        </Button>)}
      <Button variant="secondary" asChild>
        <Link href="/profile">Profile</Link>
      </Button>
      <AuthButton />
    </div>
  </div>)
}