<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import http from '@/services/http'
import { ref } from 'vue'
import Upload from '@/components/form/Upload.vue'

const router = useRouter()
const loading = ref(false)
const imagePreview = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(100, 'Product name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock must be 0 or greater'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be less than 50 characters'),
  image: z.instanceof(File).optional().or(z.string().optional()),
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    image: undefined,
  }
})

const handleFileSelected = (file: File, url: string | null) => {
  imageFile.value = file
  // Use the uploaded URL if available, otherwise use the file
  if (url) {
    form.setFieldValue('image', url)
    imagePreview.value = url
  } else {
    form.setFieldValue('image', file)
    // Create local preview as fallback
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleFileRemoved = () => {
  imageFile.value = null
  imagePreview.value = null
  form.setFieldValue('image', undefined)
}

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('price', values.price.toString())
    formData.append('stock', values.stock.toString())
    formData.append('sku', values.sku)
    
    // Use the uploaded image URL if available, otherwise use the file
    if (values.image) {
      if (typeof values.image === 'string') {
        // It's already a URL from the upload
        formData.append('image', values.image)
      } else if (imageFile.value) {
        // Fallback to file upload
        formData.append('image', imageFile.value)
      }
    }
    
    // Use FormData with multipart/form-data content type
    const res = await http.post('/product/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (res.data.code === 1) {
      router.push('/products')
    } else {
      console.error('Error creating product:', res.data.message)
    }
  } catch (error) {
    console.error('Error creating product:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto py-6 max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Create Product</h1>
      <Button variant="outline" @click="router.push('/products')">
        Back to Products
      </Button>
    </div>

    <form @submit="onSubmit" class="space-y-6">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Product Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter product name" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            The name of the product as it will appear to customers.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="sku">
        <FormItem>
          <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
          <FormControl>
            <Input placeholder="Enter SKU" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            A unique identifier for this product.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="image">
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <Upload 
              @file-selected="handleFileSelected"
              @file-removed="handleFileRemoved"
            />
          </FormControl>
          <FormDescription>
            Upload a product image. Maximum file size: 5MB
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <textarea
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter product description"
              v-bind="componentField"
            />
          </FormControl>
          <FormDescription>
            A detailed description of the product.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="price">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                v-bind="componentField"
                @update:model-value="(val: string) => form.setFieldValue('price', parseFloat(val) || 0)"
              />
            </FormControl>
            <FormDescription>
              The price of the product.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="stock">
          <FormItem>
            <FormLabel>Stock Quantity</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                v-bind="componentField"
                @update:model-value="(val: string) => form.setFieldValue('stock', parseInt(val) || 0)"
              />
            </FormControl>
            <FormDescription>
              Available stock quantity.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="flex gap-4 justify-end">
        <Button type="button" variant="outline" @click="router.push('/products')">
          Cancel
        </Button>
        <Button type="submit" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create Product' }}
        </Button>
      </div>
    </form>
  </div>
</template>

