<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import http from '@/services/http'
import { ref } from 'vue'
import Upload from '@/components/form/Upload.vue'

const router = useRouter()
const loading = ref(false)
const profileLogoPreview = ref<string | null>(null)
const profileLogoFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const coverFile = ref<File | null>(null)

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100, 'Store name must be less than 100 characters'),
  type: z.string().min(1, 'Store type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address must be less than 200 characters'),
  saleName: z.string().min(2, 'Sale name must be at least 2 characters').max(50, 'Sale name must be less than 50 characters'),
  salePosition: z.string().min(2, 'Sale position must be at least 2 characters').max(50, 'Sale position must be less than 50 characters'),
  profileLogo: z.instanceof(File).optional().or(z.string().optional()),
  cover: z.instanceof(File).optional().or(z.string().optional()),
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    type: '',
    description: '',
    address: '',
    saleName: '',
    salePosition: '',
    profileLogo: undefined,
    cover: undefined,
  }
})

const handleProfileLogoSelected = (file: File, url: string | null) => {
  profileLogoFile.value = file
  if (url) {
    form.setFieldValue('profileLogo', url)
    profileLogoPreview.value = url
  } else {
    form.setFieldValue('profileLogo', file)
    const reader = new FileReader()
    reader.onload = (e) => {
      profileLogoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleProfileLogoRemoved = () => {
  profileLogoFile.value = null
  profileLogoPreview.value = null
  form.setFieldValue('profileLogo', undefined)
}

const handleCoverSelected = (file: File, url: string | null) => {
  coverFile.value = file
  if (url) {
    form.setFieldValue('cover', url)
    coverPreview.value = url
  } else {
    form.setFieldValue('cover', file)
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleCoverRemoved = () => {
  coverFile.value = null
  coverPreview.value = null
  form.setFieldValue('cover', undefined)
}

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('type', values.type)
    formData.append('description', values.description)
    formData.append('address', values.address)
    formData.append('sale_name', values.saleName)
    formData.append('sale_position', values.salePosition)
    
    if (values.profileLogo) {
      if (typeof values.profileLogo === 'string') {
        formData.append('profile_logo', values.profileLogo)
      } else if (profileLogoFile.value) {
        formData.append('profile_logo', profileLogoFile.value)
      }
    }
    
    if (values.cover) {
      if (typeof values.cover === 'string') {
        formData.append('cover', values.cover)
      } else if (coverFile.value) {
        formData.append('cover', coverFile.value)
      }
    }
    
    const res = await http.post('/store/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (res.data.code === 1) {
      router.push('/stores')
    } else {
      console.error('Error creating store:', res.data.message)
    }
  } catch (error) {
    console.error('Error creating store:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto py-6 max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Create Store</h1>
      <Button variant="outline" @click="router.push('/stores')">
        Back to Stores
      </Button>
    </div>

    <form @submit="onSubmit" class="space-y-6">
      <!-- Cover Image -->
      <FormField name="cover">
        <FormItem>
          <FormLabel>Cover Image</FormLabel>
          <FormControl>
            <Upload 
              @file-selected="handleCoverSelected"
              @file-removed="handleCoverRemoved"
            />
          </FormControl>
          <FormDescription>
            Upload a cover image for your store. Maximum file size: 5MB
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Profile Logo -->
      <FormField name="profileLogo">
        <FormItem>
          <FormLabel>Profile Logo</FormLabel>
          <FormControl>
            <Upload 
              @file-selected="handleProfileLogoSelected"
              @file-removed="handleProfileLogoRemoved"
            />
          </FormControl>
          <FormDescription>
            Upload a profile logo for your store. Maximum file size: 5MB
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Store Name -->
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Store Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter store name" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            The name of your store as it will appear to customers.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Store Type -->
      <FormField v-slot="{ componentField }" name="type">
        <FormItem>
          <FormLabel>Store Type</FormLabel>
          <Select v-model="componentField.modelValue" @update:model-value="(val: unknown) => form.setFieldValue('type', val != null ? String(val) : '')">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select store type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="brick_mortar">Brick & Mortar</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Select the type of store.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Description -->
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <textarea
              class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter store description"
              v-bind="componentField"
            />
          </FormControl>
          <FormDescription>
            A detailed description of your store.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Address -->
      <FormField v-slot="{ componentField }" name="address">
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <textarea
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter store address"
              v-bind="componentField"
            />
          </FormControl>
          <FormDescription>
            The physical address of your store.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Sale Name and Position -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="saleName">
          <FormItem>
            <FormLabel>Sale Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter sale name" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Name of the sales person.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="salePosition">
          <FormItem>
            <FormLabel>Sale Position</FormLabel>
            <FormControl>
              <Input placeholder="Enter sale position" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Position of the sales person.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="flex gap-4 justify-end">
        <Button type="button" variant="outline" @click="router.push('/stores')">
          Cancel
        </Button>
        <Button type="submit" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create Store' }}
        </Button>
      </div>
    </form>
  </div>
</template>

