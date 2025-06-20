"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMatchResultSchema,
  createMatchResultType,
} from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Club, Court, Match, Profile, Reservation } from "@/lib/schema";
import { saveMatchResult } from "@/app/actions/matches";
import { useEffect, useState } from "react";
import { getClubProfiles } from "@/app/actions/profiles";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

type ReservationWithCourtAndClub = Reservation & {
  court: Court & {
    club: Club;
  };
  match: Match | null;
};

export function AddMatchResultForm({
  reservation,
}: {
  reservation: ReservationWithCourtAndClub;
}) {
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [profiles, setProfiles] = useState<
    Pick<Profile, "id" | "firstName" | "lastName">[]
  >([]);

  useEffect(() => {
    async function fetchProfiles() {
      const clubProfiles = await getClubProfiles(reservation.court.clubId);
      setProfiles(clubProfiles);
    }
    fetchProfiles();
  }, [reservation.court.clubId]);

  const form = useForm<createMatchResultType>({
    resolver: zodResolver(createMatchResultSchema),
    defaultValues: {
      reservationId: reservation.id,
      matchType: "singles",
      players: [{ profileId: "", team: 1 }, { profileId: "", team: 2 }],
      sets: [{ setNumber: 1, team1Score: 0, team2Score: 0 }],
    },
  });

  const { fields: playerFields, replace: replacePlayers } = useFieldArray({
    control: form.control,
    name: "players",
  });

  const {
    fields: setFields,
    append: appendSet,
    remove: removeSet,
  } = useFieldArray({
    control: form.control,
    name: "sets",
  });

  const matchType = form.watch("matchType");

  useEffect(() => {
    if (matchType === "singles") {
      replacePlayers([{ profileId: "", team: 1 }, { profileId: "", team: 2 }]);
    } else {
      replacePlayers([
        { profileId: "", team: 1 },
        { profileId: "", team: 1 },
        { profileId: "", team: 2 },
        { profileId: "", team: 2 },
      ]);
    }
  }, [matchType, replacePlayers]);

  async function onSubmit(values: createMatchResultType) {
    const result = await saveMatchResult(values);
    if (result.success) {
      setSubmissionStatus({
        success: true,
        message: "Match result saved successfully",
      });
    } else {
      setSubmissionStatus({ success: false, message: result.error as string });
    }
  }

  if (submissionStatus?.success) {
    return (
      <div className="text-center">
        <p>{submissionStatus.message}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="matchType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a match type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="singles">Singles</SelectItem>
                  <SelectItem value="doubles">Doubles</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <Collapsible>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="text-lg font-medium">Players</h3>
              <ChevronsUpDown className="h-4 w-4" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              {playerFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`players.${index}.profileId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Player {index + 1}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a player" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {profiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.firstName} {profile.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`players.${index}.team`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team</FormLabel>
                        <Input {...field} type="number" readOnly />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="text-lg font-medium">Sets</h3>
              <ChevronsUpDown className="h-4 w-4" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              {setFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <p className="font-semibold">Set {index + 1}</p>
                  <FormField
                    control={form.control}
                    name={`sets.${index}.team1Score`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team 1 Score</FormLabel>
                        <Input {...field} type="number" min="0" max="7" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`sets.${index}.team2Score`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team 2 Score</FormLabel>
                        <Input {...field} type="number" min="0" max="7" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`sets.${index}.team1TiebreakScore`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>T1 Tiebreak</FormLabel>
                        <Input {...field} type="number" min="0" max="10" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`sets.${index}.team2TiebreakScore`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>T2 Tiebreak</FormLabel>
                        <Input {...field} type="number" min="0" max="10" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeSet(index)}
                  >
                    Remove Set
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendSet({
                  setNumber: setFields.length + 1,
                  team1Score: 0,
                  team2Score: 0,
                })
              }
              className="mt-4"
            >
              Add Set
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {submissionStatus && !submissionStatus.success && (
          <div className="text-red-500">{submissionStatus.message}</div>
        )}
        <Button type="submit">Save Result</Button>
      </form>
    </Form>
  );
} 