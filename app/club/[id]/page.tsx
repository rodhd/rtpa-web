import { isProfileClubManager } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const supabase = createClient();

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

    return <div>
        <h1>Club ID: {params.id}</h1>
    </div>
}