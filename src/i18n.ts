import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import kh from './locales/kh.json'
import { useLocaleStore } from './store/locat'
import { watch } from 'vue'

const localeStore = useLocaleStore()

export const i18n = createI18n({
  legacy: false,
  locale: localeStore.locale,
  messages: {
    en,
    kh
  }
})

// Watch for locale changes and update i18n
watch(
  () => localeStore.locale,
  (newLocale) => {
    i18n.global.locale.value = newLocale as 'en' | 'kh'
  }
)
