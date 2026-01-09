import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

export default function authMiddleware({ next }: { next: any }) {

  const router = useRouter()
  const auth = useAuthStore()
  if (!auth.token) {
    console.log("redirecting to login")
    router.push('/login')
    return
  }

  
  return next()
}
