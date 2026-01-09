import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './pinia'
import { i18n } from './i18n'

// Initialize dark mode before app mounts to prevent flash
const savedLayoutMode = localStorage.getItem('layoutMode') || 'light'
if (savedLayoutMode === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

createApp(App).use(router).use(pinia).use(i18n).mount('#app')
