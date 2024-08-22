"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Club } from "@/lib/schema";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";


const profileFormSchema = z.object({
  firstName: z.string().min(3, {
    message: "First name must be longer than 3 characters."
  }),
  lastName: z.string().min(3, {
    message: "Last name must be longer than 3 characters."
  }),
  clubIds: z.array(z.number().int())
});

type additionalProps = {
  clubs: Club[] | null
}

type profileFormSchemaType = z.infer<typeof profileFormSchema>
type profileFormProps = profileFormSchemaType & additionalProps

export function ProfileForm(props: profileFormProps) {
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

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log(values)
  }

  const selectList = props.clubs?.map(club =>
    <SelectItem value={club.id.toString()} key={club.id}>{club.name}</SelectItem>
  )

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
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {form.getValues().clubIds.length > 0 ? `${form.getValues().clubIds.length} selected` : "Select a club"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
