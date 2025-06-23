import { getClub, getClubLeaderboardByClubId } from "@/app/actions/clubs";
import { BackButton } from "@/components/BackButton";
import { LeaderboardTable } from "@/components/club/LeaderboardTable";
import { columns } from "@/components/club/LeaderboardTableColumns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LeaderboardPageProps {
  params: Promise<{ clubId: string }>;
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const { clubId } = await params;
  const leaderboardData = await getClubLeaderboardByClubId(Number(clubId));
  return (
    <div className="container mx-auto py-10">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            Club members ranked by their match performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable columns={columns} data={leaderboardData} />
        </CardContent>
      </Card>
    </div>
  );
} 