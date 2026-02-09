<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useLanguage } from '@/composables/useLanguage';
import { LayoutDashboard, Package, FolderOpen, Users, ListTodo, Globe } from 'lucide-vue-next';

const { t, isRTL, currentLanguage, setLanguage } = useLanguage();
const route = useRoute();

const navigation = computed(() => [
  {
    name: t('dashboard'),
    href: '/dashboard',
    icon: LayoutDashboard,
    current: route.path === '/dashboard',
  },
  {
    name: t('releases'),
    href: '/releases',
    icon: Package,
    current: route.path === '/releases',
  },
  {
    name: t('projects'),
    href: '/projects',
    icon: FolderOpen,
    current: route.path === '/projects',
  },
  {
    name: t('teams'),
    href: '/teams',
    icon: Users,
    current: route.path === '/teams',
  },
  {
    name: t('releaseItems'),
    href: '/release-items',
    icon: ListTodo,
    current: route.path === '/release-items',
  },
]);

const toggleLanguage = () => {
  setLanguage(currentLanguage.value === 'en' ? 'ar' : 'en');
};
</script>

<template>
  <div class="min-h-screen bg-slate-50" :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- Navigation -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <Package class="w-8 h-8 text-indigo-600" />
              <span class="ml-2 text-xl font-bold text-slate-800">{{ t('releaseManager') }}</span>
            </div>
            <div :class="`hidden sm:${isRTL ? 'mr' : 'ml'}-6 sm:flex sm:space-x-8`">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                :class="[
                  item.current
                    ? 'border-indigo-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                ]"
              >
                <component :is="item.icon" class="w-5 h-5 mr-2" />
                {{ item.name }}
              </RouterLink>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="toggleLanguage"
              class="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
              <Globe class="w-4 h-4 mr-2" />
              {{ currentLanguage === 'en' ? 'العربية' : 'English' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              item.current
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700',
              'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 inline mr-2" />
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>
