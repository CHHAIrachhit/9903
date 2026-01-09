import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref(localStorage.getItem('locale') || 'en')

  function setLocale(value: string) {
    locale.value = value
    localStorage.setItem('locale', value)
  }  

  function getLocale() {
    return locale.value
  }

  return { locale, setLocale, getLocale }
})
