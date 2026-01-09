<script setup lang="ts">
import { Home, Settings, Store, List, Users, Receipt } from 'lucide-vue-next'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'home',
    url: '/',
    icon: Home,
  },
  {
    title: 'store',
    url: '/stores',
    icon: Store,
  },
  {
    title: 'items',
    url: '/items',
    icon: List,
  },
  {
    title: 'customers',
    url: '/customers',
    icon: Users,
  },
  {
    title: 'invoices',
    url: '/invoices',
    icon: Receipt,
  },
  {
    title: 'settings',
    url: '#',
    icon: Settings,
  },
]
</script>

<template>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child>
                <a :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ $t(`${item.title}`) }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
</template>
