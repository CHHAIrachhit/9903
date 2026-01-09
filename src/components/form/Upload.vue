<script setup lang="ts">
import { ref } from 'vue'
import { Upload as UploadIcon, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUploadStore } from '@/store/upload'

const uploadStore = useUploadStore()

const emit = defineEmits<{
  'file-selected': [file: File, url: string | null]
  'file-removed': []
}>()

const isDragging = ref(false)

const processFile = async (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }

  try {
    const res = await uploadStore.uploadImage(file)
    if (res.code === 1) {
      emit('file-selected', file, uploadStore.uploadedImageUrl)
    } else {
      alert(res.message || 'Failed to upload image')
    }
  } catch (error) {
    alert('Error uploading image. Please try again.')
    console.error('Upload error:', error)
  }
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    processFile(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      processFile(file)
    }
  }
}

const removeImage = () => {
  uploadStore.clearImage()
  emit('file-removed')
  // Reset file input
  const fileInput = document.getElementById('image-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}
</script>
<template>
  <div class="space-y-4">
    <div v-if="uploadStore.imagePreview || uploadStore.uploadedImageUrl" class="relative inline-block">
      <img
        :src="uploadStore.uploadedImageUrl || uploadStore.imagePreview"
        alt="Product preview"
        class="h-48 w-48 object-cover rounded-lg border border-input"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        class="absolute top-2 right-2 h-8 w-8"
        @click="removeImage"
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
    <div
      v-else
      class="flex items-center justify-center w-full"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <label
        for="image-upload"
        :class="[
          'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/10 border-solid'
            : 'border-input hover:bg-accent/50'
        ]"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon v-if="!uploadStore.uploading" class="w-10 h-10 mb-3 text-muted-foreground" />
          <div v-else class="w-10 h-10 mb-3 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p class="mb-2 text-sm text-muted-foreground">
            <span v-if="!uploadStore.uploading" class="font-semibold">Click to upload</span>
            <span v-else class="font-semibold">Uploading...</span>
            <span v-if="!uploadStore.uploading"> or drag and drop</span>
          </p>
          <p v-if="!uploadStore.uploading" class="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
        </div>
        <input
          id="image-upload"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleImageChange"
        />
      </label>
    </div>
  </div>
</template>