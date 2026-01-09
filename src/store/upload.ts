import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@/services/http'

export const useUploadStore = defineStore('upload', () => {
  const imageFile = ref<File | null>(null)
  const imagePreview = ref<string | null>(null)
  const uploadedImageUrl = ref<string | null>(null)
  const uploading = ref(false)

  async function uploadImage(file: File) {
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Don't set Content-Type header - let browser set it with boundary
      const res = await http.post('publics/image_upload', formData)
      
      if (res.data.code === 1) {
        imageFile.value = file
        // Use full URL (iamge_url) if available, otherwise use relative url
        const imageUrl = res.data.data.iamge_url || res.data.data.url
        uploadedImageUrl.value = imageUrl
        
        // Create local preview for immediate display
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
      
      return res.data
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      uploading.value = false
    }
  }

  function clearImage() {
    imageFile.value = null
    imagePreview.value = null
    uploadedImageUrl.value = null
  }

  return { 
    imageFile, 
    imagePreview, 
    uploadedImageUrl,
    uploading,
    uploadImage, 
    clearImage 
  }
})