<script setup lang="ts">
  import {
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
  } from '@/components/ui/sidebar'
  
  import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel 
  } from '@/components/ui/select/index'
  
  import { Button } from '@/components/ui/button'
  import { Moon, Sun, LogOut, User, Globe, GalleryVerticalEnd } from 'lucide-vue-next'
  import SidebarItem from '@/components/sitebar/index.vue'
  import { useAuthStore } from '@/store/auth'
  import { useLocaleStore } from '@/store/locat'
  import { useLayoutModeStore } from '@/store/laoutMode'
  import { useRouter } from 'vue-router'
  import { computed } from 'vue'

  
  const auth = useAuthStore()
  const router = useRouter()
  const localeStore = useLocaleStore()
  const layoutModeStore = useLayoutModeStore()
  
  const locale = computed({
    get: () => localeStore.locale,
    set: (value: string) => localeStore.setLocale(value)
  })
  const layoutMode = computed({
    get: () => layoutModeStore.layoutMode,
    set: (value: 'light' | 'dark') => layoutModeStore.setLayoutMode(value)
  })
  
  const logout = async () => {
    try {
      await auth.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }
  
  function toggleLayoutMode() {
    const newMode = layoutMode.value === 'dark' ? 'light' : 'dark'
    layoutModeStore.setLayoutMode(newMode)
  }

 
  </script>
  
  <template>
    <SidebarProvider v-if="auth.user">
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd class="size-4" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">Acme Inc</span>
                  <span class="truncate text-xs">Enterprise</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
  
        <SidebarItem />
  
        <SidebarFooter />
        <SidebarRail />
      </Sidebar>
  
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div class="flex items-center gap-4">
            <SidebarTrigger class="-ml-1" />
          </div>
  
          <div class="flex items-center gap-3">
            <!-- Language Selector -->
            <div class="flex items-center gap-2">
              <Globe class="h-4 w-4 text-muted-foreground" />
              <Select v-model="locale">
                <SelectTrigger class="w-[140px] h-9">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="kh">Khmer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
  
            <!-- Dark Mode Toggle -->
            <Button
              variant="ghost"
              size="icon"
              class="h-9 w-9"
              @click="toggleLayoutMode"
              :title="layoutMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <Sun v-if="layoutMode === 'dark'" class="h-4 w-4" />
              <Moon v-else class="h-4 w-4" />
              <span class="sr-only">Toggle theme</span>
            </Button>
  
            <!-- User Info & Logout -->
            <div class="flex items-center gap-3 pl-3 border-l">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User class="h-4 w-4 text-primary" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-medium leading-none">{{ auth.user?.username }}</span>
                  <span class="text-xs text-muted-foreground leading-none mt-0.5">User</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                class="h-9 gap-2"
                @click="logout"
              >
                <LogOut class="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>
  
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <router-view />
        </div>
      </SidebarInset>
    </SidebarProvider>
  
    <!-- If no user → show login page -->
    <router-view v-else />
  </template>
  