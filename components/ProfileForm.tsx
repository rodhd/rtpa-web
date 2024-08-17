"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";


const profileFormSchema = z.object({
  firstName: z.string().min(3, {
    message: "First name must be longer than 3 characters."
  }),
  lastName: z.string().min(3, {
    message: "Last name must be longer than 3 characters."
  }),
  clubIds: z.array(z.number().int())
});

type profileFormProps = z.infer<typeof profileFormSchema>

export function ProfileForm(props: profileFormProps) {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: props.firstName,
      lastName: props.lastName,
      clubIds: props.clubIds
    }
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({field}) => (
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
          render={({field}) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )} />
          <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
