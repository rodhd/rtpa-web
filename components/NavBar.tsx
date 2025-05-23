import Link from "next/link";
import { Button } from "./ui/button";
import { auth, currentUser } from '@clerk/nextjs/server'
import { IsManager } from "@/app/actions";

export default async function NavBar() {
  const user = await currentUser()
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
    </div>
  </div>)
}