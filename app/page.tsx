import Header from "@/components/Header";
import TennisClubGrid from "@/components/home/TennisClubGrid";
import { getClubs } from "./actions";

export default async function Index() {
  const clubs = await getClubs();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          {clubs && <TennisClubGrid clubs={clubs}/>}
        </main>
      </div>
    </div>
  );
}
