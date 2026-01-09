<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
const apiUrl = import.meta.env.VITE_API_URL

console.log("API URL:", apiUrl)

const formSchema = toTypedSchema(z.object({
  username: z.string().min(2).max(50),
}))
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <h1 class="text-2xl ">Create Customer</h1>
  <div class="flex flex-col gap-4">

    <form @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="username">
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="shadcn" v-bind="componentField" />
      </FormControl>
      <FormDescription>
        This is your public display name.
      </FormDescription>
      <FormMessage />
    </FormItem>
    <Button  type="submit">
      Submit
    </Button>
  </FormField>
  </form>

    
  </div>
</template>
