import { getClub, isProfileClubManager } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const isClubManager = await isProfileClubManager(params.id);

    if (!isClubManager) {
        return redirect("/");
    }

    const club = await getClub(params.id);

    return <div>
        <h1>{club?.name ?? ""}</h1>
        <h2>{club?.website ?? ""}</h2>
    </div>
}