import { defineStore } from 'pinia'
import  http  from '@/services/http'
import { ref } from 'vue'


export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null)

  async function signIn(payload: any) {
    const res = await http.post('/user/login', payload)

    if(res.data.code === 1) {
      token.value = res.data.data.userinfo.token
      user.value = res.data.data.userinfo

      // Save to localStorage
      localStorage.setItem('token', token.value || '')
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    
    return res.data
  }

  async function logout() {
    const res : any = await http.post('/user/logout')

    if(res.data.code === 1) {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    
    return res.data
  }
   

  return { token, user, signIn, logout }
})
