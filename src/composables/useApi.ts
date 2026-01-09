import { ref } from 'vue'
import http from '@/services/http'

export function useApi() {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // GET
  const get = async (url: string, params: any = {}) => {
    loading.value = true
    error.value = null

    try {
      const res = await http.get(url, { params })
      data.value = res.data
    } catch (err: any) {
      error.value = err.response?.data || err.message
    } finally {
      loading.value = false
    }
  }

  // POST
  const post = async (url: string, payload: any = {}) => {
    loading.value = true
    error.value = null

    try {
      const res = await http.post(url, payload)
      data.value = res.data
    } catch (err: any) {
      error.value = err.response?.data || err.message
    } finally {
      loading.value = false
    }
  }

  // PUT
  const put = async (url: string, payload: any = {}) => {
    loading.value = true
    error.value = null

    try {
      const res = await http.put(url, payload)
      data.value = res.data
    } catch (err: any) {
      error.value = err.response?.data || err.message
    } finally {
      loading.value = false
    }
  }

  // DELETE
  const remove = async (url: string) => {
    loading.value = true
    error.value = null

    try {
      const res = await http.delete(url)
      data.value = res.data
    } catch (err: any) {
      error.value = err.response?.data || err.message
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,

    get,
    post,
    put,
    remove,
  }
}
