<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { base44, type Release, type Project, type Team } from '@/api/base44Client';
import { useLanguage } from '@/composables/useLanguage';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';
import { Search, Plus, Package, Edit, Trash2, Loader2, Calendar } from 'lucide-vue-next';
import { format } from 'date-fns';

const { t, isRTL } = useLanguage();
const router = useRouter();
const queryClient = useQueryClient();

const STATUS_CONFIG = {
  planning: { label: computed(() => t('planning')), color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: computed(() => t('inProgress')), color: 'bg-blue-100 text-blue-700' },
  testing: { label: computed(() => t('testing')), color: 'bg-purple-100 text-purple-700' },
  ready_for_deploy: { label: computed(() => t('readyForDeploy')), color: 'bg-amber-100 text-amber-700' },
  deployed: { label: computed(() => t('deployed')), color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: computed(() => t('cancelled')), color: 'bg-rose-100 text-rose-700' },
};

const PRIORITY_CONFIG = {
  low: { label: computed(() => t('low')), color: 'bg-slate-100 text-slate-700' },
  medium: { label: computed(() => t('medium')), color: 'bg-blue-100 text-blue-700' },
  high: { label: computed(() => t('high')), color: 'bg-amber-100 text-amber-700' },
  critical: { label: computed(() => t('critical')), color: 'bg-rose-100 text-rose-700' },
};

const searchQuery = ref('');
const statusFilter = ref<string>('all');

const { data: releases, isLoading } = useQuery({
  queryKey: ['releases'],
  queryFn: () => base44.entities.Release.list(),
});

const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: () => base44.entities.Project.list(),
});

const { data: teams } = useQuery({
  queryKey: ['teams'],
  queryFn: () => base44.entities.Team.list(),
});

const deleteMutation = useMutation({
  mutationFn: (id: string) => base44.entities.Release.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['releases'] });
  },
});

const getProjectName = (projectId?: string) => {
  if (!projectId || !projects.value || !Array.isArray(projects.value) || projects.value.length === 0) return t('unassigned');
  const project = projects.value.find((p: Project) => p.id === projectId);
  return project?.name || t('unassigned');
};

const getTeamName = (teamId?: string) => {
  if (!teamId || !teams.value || !Array.isArray(teams.value) || teams.value.length === 0) return t('unassigned');
  const team = teams.value.find((t: Team) => t.id === teamId);
  return team?.name || t('unassigned');
};

const formatDate = (dateString?: string) => {
  if (!dateString) return t('notSet');
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const filteredReleases = computed(() => {
  if (!releases.value || !Array.isArray(releases.value) || releases.value.length === 0) return [];
  
  return releases.value.filter((release: Release) => {
    const matchesSearch =
      !searchQuery.value ||
      release.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      release.version.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || release.status === statusFilter.value;
    return matchesSearch && matchesStatus;
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
          <h1 class="text-3xl font-bold text-slate-800">{{ t('releases') }}</h1>
          <p class="text-slate-500 mt-1">Manage all your software releases</p>
        </div>
        <Button class="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Plus class="w-4 h-4" />
          {{ t('newRelease') }}
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
            placeholder="Search releases..."
            :class="isRTL ? 'pr-10' : 'pl-10'"
          />
        </div>
        <select
          v-model="statusFilter"
          class="w-40 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">{{ t('allStatus') }}</option>
          <option v-for="(config, key) in STATUS_CONFIG" :key="key" :value="key">
            {{ config.label.value }}
          </option>
        </select>
      </div>

      <!-- Releases Grid -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
      </div>
      <div v-else-if="filteredReleases.length === 0" class="text-center py-16">
        <Package class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-600">No releases found</h3>
        <p class="text-slate-400 mt-1">Create your first release to get started</p>
        <Button class="mt-4 bg-indigo-600 hover:bg-indigo-700">
          <Plus :class="`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`" />
          {{ t('createRelease') }}
        </Button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="release in filteredReleases"
          :key="release.id"
          class="opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]"
        >
          <Card class="hover:shadow-lg transition-shadow">
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Package class="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle class="text-lg">{{ release.name }}</CardTitle>
                    <p class="text-sm text-slate-500">v{{ release.version }}</p>
                  </div>
                </div>
                <div class="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit class="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteMutation.mutate(release.id)">
                    <Trash2 class="w-4 h-4 text-rose-400" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p v-if="release.description" class="text-sm text-slate-500 mb-4 line-clamp-2">
                {{ release.description }}
              </p>
              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm">
                  <Calendar class="w-4 h-4 text-slate-400" />
                  <span class="text-slate-600">{{ formatDate(release.scheduledDate) }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-slate-500">Project:</span>
                  <span class="text-slate-700 font-medium">{{ getProjectName(release.projectId) }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-slate-500">Team:</span>
                  <span class="text-slate-700 font-medium">{{ getTeamName(release.teamId) }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <Badge :class="STATUS_CONFIG[release.status]?.color">
                  {{ STATUS_CONFIG[release.status]?.label.value }}
                </Badge>
                <Badge :class="PRIORITY_CONFIG[release.priority]?.color">
                  {{ PRIORITY_CONFIG[release.priority]?.label.value }}
                </Badge>
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
