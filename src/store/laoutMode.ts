import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useLayoutModeStore = defineStore('layoutMode', () => {
  const layoutMode = ref<'light' | 'dark'>((localStorage.getItem('layoutMode') as 'light' | 'dark') || 'light')

  // Apply dark mode class to document
  function applyLayoutMode(mode: 'light' | 'dark') {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize on store creation
  applyLayoutMode(layoutMode.value)

  function setLayoutMode(value: 'light' | 'dark') {
    layoutMode.value = value
    localStorage.setItem('layoutMode', value)
    applyLayoutMode(value)
  }

  function getLayoutMode() {
    return layoutMode.value
  }

  // Watch for changes and apply them
  watch(layoutMode, (newMode) => {
    applyLayoutMode(newMode)
  })

  return { layoutMode, setLayoutMode, getLayoutMode }
})