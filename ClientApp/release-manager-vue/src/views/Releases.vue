<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
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
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import DialogFooter from '@/components/ui/DialogFooter.vue';

export default defineComponent({
  name: 'ReleasesView',
  components: {
    Button,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Search,
    Plus,
    Package,
    Edit,
    Trash2,
    Loader2,
    Calendar,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  },

  setup() {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const queryClient = useQueryClient();

    const searchQuery = ref('');
    const statusFilter = ref<string>('all');
    const showDialog = ref(false);
    const editingRelease = ref<Release | null>(null);
    const formData = ref({
      name: '',
      version: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      scheduledDate: '',
      projectId: '',
      teamId: '',
    });

    const STATUS_CONFIG = computed(() => ({
      planning: { label: t('planning'), color: 'bg-slate-100 text-slate-700' },
      in_progress: { label: t('inProgress'), color: 'bg-blue-100 text-blue-700' },
      testing: { label: t('testing'), color: 'bg-purple-100 text-purple-700' },
      ready_for_deploy: { label: t('readyForDeploy'), color: 'bg-amber-100 text-amber-700' },
      deployed: { label: t('deployed'), color: 'bg-emerald-100 text-emerald-700' },
      cancelled: { label: t('cancelled'), color: 'bg-rose-100 text-rose-700' },
    }));

    const PRIORITY_CONFIG = computed(() => ({
      low: { label: t('low'), color: 'bg-slate-100 text-slate-700' },
      medium: { label: t('medium'), color: 'bg-blue-100 text-blue-700' },
      high: { label: t('high'), color: 'bg-amber-100 text-amber-700' },
      critical: { label: t('critical'), color: 'bg-rose-100 text-rose-700' },
    }));

    const { data: releases, isLoading } = useQuery({
      queryKey: ['releases'],
      queryFn: async () => {
        const result = await base44.entities.Release.list();
        return Array.isArray(result) ? result : (result?.data || result?.value || []);
      },
      enabled: true,
      staleTime: 0,
      gcTime: 0,
    });

    const { data: projects } = useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        const result = await base44.entities.Project.list();
        return Array.isArray(result) ? result : (result?.data || result?.value || []);
      },
      enabled: true,
      staleTime: 0,
      gcTime: 0,
    });

    const { data: teams } = useQuery({
      queryKey: ['teams'],
      queryFn: async () => {
        const result = await base44.entities.Team.list();
        return Array.isArray(result) ? result : (result?.data || result?.value || []);
      },
      enabled: true,
      staleTime: 0,
      gcTime: 0,
    });

    const createMutation = useMutation({
      mutationFn: (data: Partial<Release>) => base44.entities.Release.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['releases'] });
        handleCloseDialog();
      },
    });

    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Release> }) =>
        base44.entities.Release.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['releases'] });
        handleCloseDialog();
      },
    });

    const deleteMutation = useMutation({
      mutationFn: (id: string) => base44.entities.Release.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['releases'] });
      },
    });

    const getProjectName = (projectId?: string): string => {
      if (!projectId || !projects.value || !Array.isArray(projects.value) || projects.value.length === 0) {
        return t('unassigned');
      }
      const project = projects.value.find((p: Project) => p.id === projectId);
      return project?.name || t('unassigned');
    };

    const getTeamName = (teamId?: string): string => {
      if (!teamId || !teams.value || !Array.isArray(teams.value) || teams.value.length === 0) {
        return t('unassigned');
      }
      const team = teams.value.find((t: Team) => t.id === teamId);
      return team?.name || t('unassigned');
    };

    const formatDate = (dateString?: string): string => {
      if (!dateString) return t('notSet');
      return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const handleOpenDialog = (release?: Release): void => {
      if (release) {
        editingRelease.value = release;
        formData.value = {
          name: release.name || '',
          version: release.version || '',
          description: release.description || '',
          status: release.status || 'planning',
          priority: release.priority || 'medium',
          scheduledDate: release.scheduledDate || '',
          projectId: release.projectId || '',
          teamId: release.teamId || '',
        };
      } else {
        editingRelease.value = null;
        formData.value = {
          name: '',
          version: '',
          description: '',
          status: 'planning',
          priority: 'medium',
          scheduledDate: '',
          projectId: '',
          teamId: '',
        };
      }
      showDialog.value = true;
    };

    const handleCloseDialog = (): void => {
      showDialog.value = false;
      editingRelease.value = null;
      formData.value = {
        name: '',
        version: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        scheduledDate: '',
        projectId: '',
        teamId: '',
      };
    };

    const handleSave = (): void => {
      if (editingRelease.value) {
        updateMutation.mutate({
          id: editingRelease.value.id,
          data: formData.value,
        });
      } else {
        createMutation.mutate(formData.value);
      }
    };

    const filteredReleases = computed((): Release[] => {
      if (!releases.value || !Array.isArray(releases.value) || releases.value.length === 0) {
        return [];
      }
      
      return releases.value.filter((release: Release) => {
        const matchesSearch =
          !searchQuery.value ||
          release.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          release.version.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesStatus = statusFilter.value === 'all' || release.status === statusFilter.value;
        return matchesSearch && matchesStatus;
      });
    });

    return {
      // State
      searchQuery,
      statusFilter,
      showDialog,
      editingRelease,
      formData,
      // Data
      releases,
      projects,
      teams,
      isLoading,
      // Mutations
      createMutation,
      updateMutation,
      deleteMutation,
      // Computed
      filteredReleases,
      STATUS_CONFIG,
      PRIORITY_CONFIG,
      // Methods
      getProjectName,
      getTeamName,
      formatDate,
      handleOpenDialog,
      handleCloseDialog,
      handleSave,
      // Utilities
      t,
      isRTL,
    };
  },

  mounted() {
    console.log('🎯 Releases page mounted - ready to display data');
  },
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
        <Button @click="handleOpenDialog()" class="bg-indigo-600 hover:bg-indigo-700 gap-2">
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
            {{ config.label }}
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
          class="fade-in-card"
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
                  <Button variant="ghost" size="icon" @click="handleOpenDialog(release)">
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
                  {{ STATUS_CONFIG[release.status]?.label }}
                </Badge>
                <Badge :class="PRIORITY_CONFIG[release.priority]?.color">
                  {{ PRIORITY_CONFIG[release.priority]?.label }}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Create/Edit Release Dialog -->
    <Dialog :open="showDialog" @update:open="showDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{ editingRelease ? 'Edit Release' : 'New Release' }}
          </DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Release Name</label>
            <Input v-model="formData.name" type="text" placeholder="Release Name" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Version</label>
            <Input v-model="formData.version" type="text" placeholder="e.g., 1.0.0" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Description</label>
            <Input v-model="formData.description" type="text" placeholder="Description" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Scheduled Date</label>
            <Input v-model="formData.scheduledDate" type="date" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Status</label>
            <select v-model="formData.status" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option v-for="(config, key) in STATUS_CONFIG" :key="key" :value="key">
                {{ config.label }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Priority</label>
            <select v-model="formData.priority" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option v-for="(config, key) in PRIORITY_CONFIG" :key="key" :value="key">
                {{ config.label }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Project</label>
            <select v-model="formData.projectId" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Unassigned</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Team</label>
            <select v-model="formData.teamId" class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Unassigned</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="handleCloseDialog">Cancel</Button>
          <Button @click="handleSave" class="bg-indigo-600 hover:bg-indigo-700">
            {{ editingRelease ? 'Update' : 'Create' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

.fade-in-card {
  animation: fadeIn 0.3s ease-in forwards;
}
</style>
