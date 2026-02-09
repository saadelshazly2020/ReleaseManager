<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { base44, type Release, type Team } from '@/api/base44Client';
import { useLanguage } from '@/composables/useLanguage';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';
import { RefreshCw, Plus, TrendingUp, TrendingDown, Calendar, AlertCircle } from 'lucide-vue-next';
import { format } from 'date-fns';

const { t, isRTL } = useLanguage();

const { data: releases, isLoading, refetch } = useQuery({
  queryKey: ['releases'],
  queryFn: () => base44.entities.Release.list(),
});

const { data: teams } = useQuery({
  queryKey: ['teams'],
  queryFn: () => base44.entities.Team.list(),
});

const statusConfig = {
  planning: { label: computed(() => t('planning')), color: 'bg-slate-100 text-slate-700', count: 0 },
  in_progress: { label: computed(() => t('inProgress')), color: 'bg-blue-100 text-blue-700', count: 0 },
  testing: { label: computed(() => t('testing')), color: 'bg-purple-100 text-purple-700', count: 0 },
  ready_for_deploy: { label: computed(() => t('readyForDeploy')), color: 'bg-amber-100 text-amber-700', count: 0 },
  deployed: { label: computed(() => t('deployed')), color: 'bg-emerald-100 text-emerald-700', count: 0 },
  cancelled: { label: computed(() => t('cancelled')), color: 'bg-rose-100 text-rose-700', count: 0 },
};

const stats = computed(() => {
  if (!releases.value || !Array.isArray(releases.value) || releases.value.length === 0) {
    return {
      activeReleases: 0,
      completedReleases: 0,
      upcomingReleases: 0,
      overdueReleases: 0,
    };
  }

  const activeReleases = releases.value.filter((r: Release) => 
    r.status === 'in_progress' || r.status === 'testing' || r.status === 'ready_for_deploy'
  ).length;

  const completedReleases = releases.value.filter((r: Release) => r.status === 'deployed').length;
  
  const upcomingReleases = releases.value.filter((r: Release) => 
    r.scheduledDate && new Date(r.scheduledDate) > new Date()
  ).length;

  const overdueReleases = releases.value.filter((r: Release) => 
    r.scheduledDate && 
    new Date(r.scheduledDate) < new Date() && 
    r.status !== 'deployed' &&
    r.status !== 'cancelled'
  ).length;

  return {
    activeReleases,
    completedReleases,
    upcomingReleases,
    overdueReleases,
  };
});

const statusDistribution = computed(() => {
  const distribution: Record<string, number> = {
    planning: 0,
    in_progress: 0,
    testing: 0,
    ready_for_deploy: 0,
    deployed: 0,
    cancelled: 0,
  };

  if (!releases.value || !Array.isArray(releases.value) || releases.value.length === 0) {
    return distribution;
  }

  releases.value.forEach((release: Release) => {
    if (distribution.hasOwnProperty(release.status)) {
      distribution[release.status]++;
    }
  });

  return distribution;
});

const upcomingReleases = computed(() => {
  if (!releases.value || !Array.isArray(releases.value) || releases.value.length === 0) {
    return [];
  }

  return releases.value
    .filter((r: Release) => r.scheduledDate && new Date(r.scheduledDate) > new Date())
    .sort((a: Release, b: Release) => 
      new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime()
    )
    .slice(0, 5);
});

const teamWorkload = computed(() => {
  const workload: Record<string, { name: string; activeReleases: number; color?: string }> = {};

  if (!teams.value || !Array.isArray(teams.value) || teams.value.length === 0) {
    return [];
  }

  teams.value.forEach((team: Team) => {
    workload[team.id] = {
      name: team.name,
      activeReleases: 0,
      color: team.color,
    };
  });

  if (releases.value && Array.isArray(releases.value) && releases.value.length > 0) {
    releases.value.forEach((release: Release) => {
      if (release.teamId && workload[release.teamId] && release.status !== 'deployed' && release.status !== 'cancelled') {
        workload[release.teamId].activeReleases++;
      }
    });
  }

  return Object.values(workload).filter(w => w.activeReleases > 0);
});

const getStatusColor = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-700';
};

const getStatusLabel = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig]?.label.value || status;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return format(new Date(dateString), 'MMM dd, yyyy');
};
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
          <h1 class="text-3xl font-bold text-slate-800">{{ t('releaseDashboard') }}</h1>
          <p class="text-slate-500 mt-1">{{ t('monitorReleases') }}</p>
        </div>
        <div class="flex gap-2">
          <Button @click="() => refetch()" variant="outline" class="gap-2">
            <RefreshCw class="w-4 h-4" />
            {{ t('refresh') }}
          </Button>
          <Button class="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Plus class="w-4 h-4" />
            {{ t('newRelease') }}
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-500">{{ t('activeReleases') }}</p>
                <p class="text-2xl font-bold text-slate-800 mt-1">{{ stats.activeReleases }}</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-500">{{ t('deployed') }}</p>
                <p class="text-2xl font-bold text-slate-800 mt-1">{{ stats.completedReleases }}</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp class="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-500">Upcoming</p>
                <p class="text-2xl font-bold text-slate-800 mt-1">{{ stats.upcomingReleases }}</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar class="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-500">{{ t('overdue') }}</p>
                <p class="text-2xl font-bold text-rose-600 mt-1">{{ stats.overdueReleases }}</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertCircle class="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Status Distribution -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('releaseStatusDistribution') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-for="(count, status) in statusDistribution"
                :key="status"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <Badge :class="getStatusColor(status)">
                    {{ getStatusLabel(status) }}
                  </Badge>
                </div>
                <span class="text-sm font-medium text-slate-700">{{ count }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Upcoming Releases -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('upcomingReleases') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="upcomingReleases.length === 0" class="text-center py-8 text-slate-400">
              {{ t('noUpcomingReleases') }}
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="release in upcomingReleases"
                :key="release.id"
                class="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p class="font-medium text-slate-800">{{ release.name }}</p>
                  <p class="text-sm text-slate-500">{{ release.version }}</p>
                </div>
                <div class="text-right">
                  <Badge :class="getStatusColor(release.status)" class="mb-1">
                    {{ getStatusLabel(release.status) }}
                  </Badge>
                  <p class="text-xs text-slate-500">{{ formatDate(release.scheduledDate) }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Team Workload -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle>{{ t('teamWorkload') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="teamWorkload.length === 0" class="text-center py-8 text-slate-400">
              {{ t('noTeamData') }}
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="team in teamWorkload"
                :key="team.name"
                class="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-slate-800">{{ team.name }}</h4>
                  <div
                    v-if="team.color"
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: team.color }"
                  ></div>
                </div>
                <p class="text-2xl font-bold text-slate-700">{{ team.activeReleases }}</p>
                <p class="text-sm text-slate-500 mt-1">Active Releases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
