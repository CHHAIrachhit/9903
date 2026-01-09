<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/services/http'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Store } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const stores = ref<any[]>([])

const fetchStores = async () => {
  loading.value = true
  try {
    const res = await http.get('/store/list')
    if (res.data.code === 1) {
      stores.value = res.data.data || []
    }
  } catch (error) {
    console.error('Error fetching stores:', error)
    // Set empty array on error
    stores.value = []
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this store?')) {
    return
  }
  
  try {
    const res = await http.delete(`/store/${id}`)
    if (res.data.code === 1) {
      fetchStores()
    } else {
      alert('Failed to delete store')
    }
  } catch (error) {
    console.error('Error deleting store:', error)
    alert('Error deleting store')
  }
}

onMounted(() => {
  fetchStores()
})
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Stores</h1>
      <Button @click="router.push('/stores/create')">
        <Plus class="h-4 w-4 mr-2" />
        Create Store
      </Button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading stores...</p>
    </div>

    <div v-else-if="stores.length === 0" class="flex flex-col items-center justify-center py-12 border rounded-lg">
      <Store class="h-12 w-12 text-muted-foreground mb-4" />
      <p class="text-muted-foreground mb-4">No stores found</p>
      <Button @click="router.push('/stores/create')">
        <Plus class="h-4 w-4 mr-2" />
        Create Your First Store
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="store in stores"
        :key="store.id"
        class="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Cover Image -->
        <div class="h-48 bg-muted relative">
          <img
            v-if="store.cover"
            :src="store.cover"
            :alt="store.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Store class="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <!-- Store Info -->
        <div class="p-6">
          <div class="flex items-start gap-4 mb-4">
            <!-- Profile Logo -->
            <div class="flex-shrink-0">
              <img
                v-if="store.profile_logo || store.profileLogo"
                :src="store.profile_logo || store.profileLogo"
                :alt="store.name"
                class="w-16 h-16 rounded-full object-cover border-2 border-background"
              />
              <div v-else class="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Store class="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            <!-- Store Details -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold truncate">{{ store.name }}</h3>
              <p class="text-sm text-muted-foreground capitalize">{{ store.type }}</p>
            </div>
          </div>

          <!-- Description -->
          <p v-if="store.description" class="text-sm text-muted-foreground line-clamp-2 mb-4">
            {{ store.description }}
          </p>

          <!-- Address -->
          <div v-if="store.address" class="text-sm text-muted-foreground mb-4">
            <p class="line-clamp-1">{{ store.address }}</p>
          </div>

          <!-- Sale Info -->
          <div v-if="store.sale_name || store.saleName" class="text-sm mb-4">
            <p class="font-medium">{{ store.sale_name || store.saleName }}</p>
            <p class="text-muted-foreground">{{ store.sale_position || store.salePosition }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              class="flex-1"
              @click="router.push(`/stores/${store.id}`)"
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              @click="handleDelete(store.id)"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

