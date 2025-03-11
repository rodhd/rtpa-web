import Link from "next/link";
import AuthButton from "./AuthButton";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function NavBar() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  return (<div className="w-full flex justify-between items-center p-3 text-sm">
    <Button variant="link" asChild>
      <Link href="/">Home</Link>
    </Button>
    <div className="flex flex-row justify-between items-center gap-4">
      <Button variant="secondary" asChild>
        <Link href="/profile">Profile</Link>
      </Button>
      <AuthButton />
    </div>
  </div>)
}