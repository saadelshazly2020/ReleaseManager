<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { base44, type ReleaseItem, type Release } from '@/api/base44Client';
import { useLanguage } from '@/composables/useLanguage';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';
import { Search, Plus, ListTodo, Edit, Trash2, Loader2, User, Hash } from 'lucide-vue-next';

const { t, isRTL } = useLanguage();
const queryClient = useQueryClient();

const TYPE_CONFIG = {
  feature: { label: computed(() => t('feature')), color: 'bg-blue-100 text-blue-700', icon: '✨' },
  bug_fix: { label: computed(() => t('bugFix')), color: 'bg-rose-100 text-rose-700', icon: '🐛' },
  improvement: { label: computed(() => t('improvement')), color: 'bg-purple-100 text-purple-700', icon: '⚡' },
  breaking_change: { label: computed(() => t('breakingChange')), color: 'bg-amber-100 text-amber-700', icon: '⚠️' },
  security: { label: computed(() => t('security')), color: 'bg-emerald-100 text-emerald-700', icon: '🔒' },
  documentation: { label: computed(() => t('documentation')), color: 'bg-slate-100 text-slate-700', icon: '📚' },
};

const STATUS_CONFIG = {
  pending: { label: computed(() => t('pending')), color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: computed(() => t('inProgress')), color: 'bg-blue-100 text-blue-700' },
  completed: { label: computed(() => t('completed')), color: 'bg-emerald-100 text-emerald-700' },
};

const searchQuery = ref('');
const typeFilter = ref<string>('all');

const { data: items, isLoading } = useQuery({
  queryKey: ['releaseitems'],
  queryFn: () => base44.entities.ReleaseItem.list(),
});

const { data: releases } = useQuery({
  queryKey: ['releases'],
  queryFn: () => base44.entities.Release.list(),
});

const deleteMutation = useMutation({
  mutationFn: (id: string) => base44.entities.ReleaseItem.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['releaseitems'] });
  },
});

const getReleaseName = (releaseId?: string) => {
  if (!releaseId || !releases.value || !Array.isArray(releases.value) || releases.value.length === 0) return t('unassigned');
  const release = releases.value.find((r: Release) => r.id === releaseId);
  return release ? `${release.name} (v${release.version})` : t('unassigned');
};

const filteredItems = computed(() => {
  if (!items.value || !Array.isArray(items.value) || items.value.length === 0) return [];
  
  return items.value.filter((item: ReleaseItem) => {
    const matchesSearch =
      !searchQuery.value ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.ticketNumber && item.ticketNumber.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesType = typeFilter.value === 'all' || item.type === typeFilter.value;
    return matchesSearch && matchesType;
  });
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">{{ t('releaseItems') }}</h1>
          <p class="text-slate-500 mt-1">{{ t('featuresAndBugFixes') }}</p>
        </div>
        <Button class="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Plus class="w-4 h-4" />
          {{ t('addItem') }}
        </Button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-1 max-w-md">
          <Search
            :class="`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`"
          />
          <Input
            v-model="searchQuery"
            :placeholder="t('searchItems')"
            :class="isRTL ? 'pr-10' : 'pl-10'"
          />
        </div>
        <select
          v-model="typeFilter"
          class="w-40 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">{{ t('allTypes') }}</option>
          <option v-for="(config, key) in TYPE_CONFIG" :key="key" :value="key">
            {{ config.icon }} {{ config.label.value }}
          </option>
        </select>
      </div>

      <!-- Items List -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
      </div>
      <div v-else-if="filteredItems.length === 0" class="text-center py-16">
        <ListTodo class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-600">{{ t('noItemsFound') }}</h3>
        <p class="text-slate-400 mt-1">{{ t('addFirstItem') }}</p>
        <Button class="mt-4 bg-indigo-600 hover:bg-indigo-700">
          <Plus :class="`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`" />
          {{ t('addItem') }}
        </Button>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]"
        >
          <Card class="hover:shadow-lg transition-shadow">
            <CardContent class="pt-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <Badge :class="TYPE_CONFIG[item.type]?.color">
                      {{ TYPE_CONFIG[item.type]?.icon }} {{ TYPE_CONFIG[item.type]?.label.value }}
                    </Badge>
                    <Badge :class="STATUS_CONFIG[item.status]?.color">
                      {{ STATUS_CONFIG[item.status]?.label.value }}
                    </Badge>
                  </div>
                  <h3 class="text-lg font-semibold text-slate-800 mb-2">{{ item.title }}</h3>
                  <p v-if="item.description" class="text-sm text-slate-600 mb-3">
                    {{ item.description }}
                  </p>
                  <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div v-if="item.ticketNumber" class="flex items-center gap-1">
                      <Hash class="w-4 h-4" />
                      <span>{{ item.ticketNumber }}</span>
                    </div>
                    <div v-if="item.assignedTo" class="flex items-center gap-1">
                      <User class="w-4 h-4" />
                      <span>{{ item.assignedTo }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span>Release:</span>
                      <span class="font-medium">{{ getReleaseName(item.releaseId) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit class="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteMutation.mutate(item.id)">
                    <Trash2 class="w-4 h-4 text-rose-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
