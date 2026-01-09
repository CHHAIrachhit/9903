<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/services/http'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Package } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const products = ref<any[]>([])

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await http.get('/product/list')
    if (res.data.code === 1) {
      products.value = res.data.data || []
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    // Set empty array on error
    products.value = []
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }
  
  try {
    const res = await http.delete(`/product/${id}`)
    if (res.data.code === 1) {
      fetchProducts()
    } else {
      alert('Failed to delete product')
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Error deleting product')
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Products</h1>
      <Button @click="router.push('/products/create')">
        <Plus class="h-4 w-4 mr-2" />
        Create Product
      </Button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading products...</p>
    </div>

    <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-12 border rounded-lg">
      <Package class="h-12 w-12 text-muted-foreground mb-4" />
      <p class="text-muted-foreground mb-4">No products found</p>
      <Button @click="router.push('/products/create')">
        <Plus class="h-4 w-4 mr-2" />
        Create Your First Product
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Product Image -->
        <div class="h-48 bg-muted relative">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Package class="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-6">
          <div class="mb-4">
            <h3 class="text-lg font-semibold truncate mb-1">{{ product.name }}</h3>
            <p class="text-sm text-muted-foreground mb-2">SKU: {{ product.sku }}</p>
            <p class="text-2xl font-bold text-primary">{{ formatCurrency(product.price) }}</p>
          </div>

          <!-- Description -->
          <p v-if="product.description" class="text-sm text-muted-foreground line-clamp-2 mb-4">
            {{ product.description }}
          </p>

          <!-- Stock -->
          <div class="text-sm mb-4">
            <span class="font-medium">Stock:</span>
            <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
              {{ product.stock }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              class="flex-1"
              @click="router.push(`/products/${product.id}`)"
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              @click="handleDelete(product.id)"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
