import { getClub, getClubCourts, isProfileClubManager } from "@/app/actions";
import { CourtsTable } from "@/components/club/CourtsTable";
import { CourtsTableColumns } from "@/components/club/CourtsTableColumns";
import { auth, currentUser } from '@clerk/nextjs/server'
import { CreateCourtDialog } from "@/components/club/CreateCourtDialog";

import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ clubId: string }> }) {
    const { clubId } = await params;
    const user = currentUser();

    if (!user) {
        return redirect("/");
    }

    const isClubManager = await isProfileClubManager(clubId);

    if (!isClubManager) {
        return redirect("/");
    }

    const club = await getClub(clubId);
    const clubCourts = await getClubCourts(Number(clubId));

    return <div className="flex flex-col gap-8 items-center">
        <h1 className="text-2xl">{club?.name ?? ""}</h1>
        <h2>{club?.website ?? ""}</h2>
        <CreateCourtDialog clubId={clubId} />
        <CourtsTable columns={CourtsTableColumns} data={clubCourts} />
    </div>
}