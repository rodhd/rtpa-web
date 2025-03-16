import { getClub, getClubCourts, isProfileClubManager } from "@/app/actions";
import { CourtsTable } from "@/components/club/CourtsTable";
import { CourtsTableColumns } from "@/components/club/CourtsTableColumn";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params;
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const isClubManager = await isProfileClubManager(id);

    if (!isClubManager) {
        return redirect("/");
    }

    const club = await getClub(id);
    const clubCourts = await getClubCourts(id);

    return <div className="flex flex-col gap-8 items-center">
        <h1 className="text-2xl">{club?.name ?? ""}</h1>
        <h2>{club?.website ?? ""}</h2>
        <CourtsTable columns={CourtsTableColumns} data={clubCourts} />
    </div>
}