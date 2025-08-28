<template>
    <div class="px-80 pt-20 gap-20">
        <XMenuBar :model="menuItems">
            <template #item="{ item, props, hasSubmenu }">
                <template v-if="item.items">
                    <a v-ripple class="flex align-items-center" v-bind="props.action">
                      <Icon :name="`x:${item.icon}`" />
                      <span class="ml-2">{{ item.label }}</span>
                      <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                    </a>
                </template>
                <template v-else>
                    <NuxtLink 
                      v-ripple 
                      class="flex align-items-center" 
                      :to="item.to" 
                      v-bind="props.action"
                      :class="{ 'active-menu-item': isActive(item.to) }"
                    >
                      <Icon :name="`x:${item.icon}`" />
                      <span class="ml-2">{{ item.label }}</span>
                    </NuxtLink>
                </template>
            </template>
        </XMenuBar>
        <div class="flex flex-col pt-10">
            <NuxtPage />
        </div>
    </div>
</template>

<script setup lang="ts">
import menuConfigACH from '~/router/menuRoutes';
import type { MenuBarAdminItem } from '../types/admin/menu.types';

const route = useRoute();
const menuItems = ref<MenuBarAdminItem[]>([]);

onMounted(() => {
  menuItems.value = menuConfigACH.items;
});

const isActive = (to?: string) => {
  if (!to) return false;
  return route.path === to || route.path.startsWith(to + '/');
};
</script>