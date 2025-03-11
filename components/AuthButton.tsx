import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  }

  return user ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <Button type="submit">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Button asChild>
      <Link
        href="/login"
      >
        Login
      </Link>
    </Button>
  );
}
