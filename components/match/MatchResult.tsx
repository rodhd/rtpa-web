import { Match, MatchPlayer, MatchSet, Profile } from "@/lib/schema";

type MatchResultProps = {
  match: Match & {
    matchPlayers: (MatchPlayer & {
      profile: Profile | null;
    })[];
    matchSets: MatchSet[];
  };
};

export function MatchResult({ match }: MatchResultProps) {
  const team1Players = match.matchPlayers.filter((p) => p.team === 1);
  const team2Players = match.matchPlayers.filter((p) => p.team === 2);

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-2">Match Result</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Team 1</h4>
          {team1Players.map((p) => (
            <p key={p.profileId}>
              {p.profile
                ? `${p.profile.firstName} ${p.profile.lastName}`
                : "Unknown Player"}
            </p>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Team 2</h4>
          {team2Players.map((p) => (
            <p key={p.profileId}>
              {p.profile
                ? `${p.profile.firstName} ${p.profile.lastName}`
                : "Unknown Player"}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">Scores</h4>
        <div className="flex flex-col gap-2">
          {match.matchSets.map((set) => (
            <div key={set.id} className="flex items-center gap-4">
              <p>Set {set.setNumber}:</p>
              <p>
                {set.team1Score} - {set.team2Score}
              </p>
              {set.team1TiebreakScore || set.team2TiebreakScore ? (
                <p className="text-sm text-gray-500">
                  ({set.team1TiebreakScore} - {set.team2TiebreakScore})
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 