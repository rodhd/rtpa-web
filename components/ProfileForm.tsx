"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Club } from "@/lib/schema";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { updateProfile } from "@/lib/profiles/updateProfile";
import { profileFormSchema, profileFormSchemaType } from "@/lib/profiles/profileFormSchema";
import { useTransition } from "react";

type additionalProps = {
  clubs: Club[] | null
};

type profileFormProps = profileFormSchemaType & additionalProps;

export function ProfileForm(props: profileFormProps) {
  const [isPending, startTransition] = useTransition(); 
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: props.firstName,
      lastName: props.lastName,
      clubIds: props.clubIds
    }
  });

  const onSelectClub = (value: number | string) => {
    if (!!value) {
      if (form.getValues().clubIds.includes(Number(value))) {
        form.setValue("clubIds", form.getValues().clubIds.filter(c => c !== Number(value)));
      }
      else {
        form.setValue("clubIds", Array.from((new Set([Number(value), ...form.getValues().clubIds])).values()));
      }
    }
  }

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    startTransition(async () => {
      const profile = await updateProfile(values);
      if(!!profile) {
        form.setValue("firstName", profile?.firstName ?? '');
        form.setValue("lastName", profile?.lastName ?? '');
        form.setValue("clubIds", profile.profilesToClubs.map(c => c.clubId))
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3 space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="clubIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Clubs</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {form.getValues().clubIds.length > 0 ? `${form.getValues().clubIds.length} selected` : "Select a club"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search club..." />
                    <CommandList>
                      <CommandEmpty>No clubs found.</CommandEmpty>
                      <CommandGroup>
                        {!!props.clubs && props.clubs.map((club) => (
                          <CommandItem
                            value={club.id.toString()}
                            key={club.id}
                            onSelect={() => {
                              onSelectClub(club.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(club.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {club.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the clubs where you would like to play at.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>{isPending ? '...' : 'Submit'}</Button>
      </form>
    </Form>
  )
}
