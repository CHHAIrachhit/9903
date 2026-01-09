import { createPinia, setActivePinia } from 'pinia'

const pinia = createPinia()
setActivePinia(pinia)   // activate pinia globally

export default pinia
