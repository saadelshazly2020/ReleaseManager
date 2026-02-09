<script setup lang="ts">
import { ref, computed, unref, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { base44, type Project, type Team } from '@/api/base44Client';
import { useLanguage } from '@/composables/useLanguage';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';
import { Search, Plus, FolderOpen, Edit, Trash2, Loader2, Users, Code } from 'lucide-vue-next';

const { t, isRTL } = useLanguage();
const queryClient = useQueryClient();

const STATUS_CONFIG = {
  active: { label: computed(() => t('active')), color: 'bg-emerald-100 text-emerald-700' },
  on_hold: { label: computed(() => t('onHold')), color: 'bg-amber-100 text-amber-700' },
  completed: { label: computed(() => t('completed')), color: 'bg-blue-100 text-blue-700' },
  archived: { label: computed(() => t('archived')), color: 'bg-slate-100 text-slate-700' },
};

const searchQuery = ref('');
const statusFilter = ref<string>('all');
const showDialog = ref(false);
const editingProject = ref<Project | null>(null);
const formData = ref({
  name: '',
  description: '',
  code: '',
  status: 'active',
  teamId: '',
});

const { data: projects, isLoading, error: projectsError, isSuccess, isFetching } = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    console.log('📦 Fetching projects...');
    try {
      const result = await base44.entities.Project.list('-createdDate');
      console.log('📦 Projects raw result:', result);
      console.log('📦 Result type:', typeof result);
      console.log('📦 Is array?', Array.isArray(result));
      console.log('📦 Result keys:', Object.keys(result || {}));
      
      // Handle if result is wrapped
      const data = Array.isArray(result) ? result : (result?.data || result?.value || []);
      console.log('📦 Final data:', data);
      console.log('📦 Final data type:', typeof data);
      console.log('📦 Final is array?', Array.isArray(data));
      console.log('📦 Final length:', data?.length);
      
      return data;
    } catch (err) {
      console.error('📦 Error fetching projects:', err);
      throw err;
    }
  },
});

const { data: teams } = useQuery({
  queryKey: ['teams'],
  queryFn: async () => {
    console.log('👥 Fetching teams...');
    const result = await base44.entities.Team.list();
    return Array.isArray(result) ? result : (result?.data || result?.value || []);
  },
});

const { data: releases } = useQuery({
  queryKey: ['releases'],
  queryFn: async () => {
    console.log('🚀 Fetching releases...');
    const result = await base44.entities.Release.list();
    return Array.isArray(result) ? result : (result?.data || result?.value || []);
  },
});

const createMutation = useMutation({
  mutationFn: (data: Partial<Project>) => base44.entities.Project.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    handleCloseDialog();
  },
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
    base44.entities.Project.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    handleCloseDialog();
  },
});

const deleteMutation = useMutation({
  mutationFn: (id: string) => base44.entities.Project.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  },
});

const handleOpenDialog = (project?: Project) => {
  if (project) {
    editingProject.value = project;
    formData.value = {
      name: project.name || '',
      description: project.description || '',
      code: project.code || '',
      status: project.status || 'active',
      teamId: project.teamId || '',
    };
  } else {
    editingProject.value = null;
    formData.value = { name: '', description: '', code: '', status: 'active', teamId: '' };
  }
  showDialog.value = true;
};

const handleCloseDialog = () => {
  showDialog.value = false;
  editingProject.value = null;
  formData.value = { name: '', description: '', code: '', status: 'active', teamId: '' };
};

const handleSave = () => {
  if (editingProject.value) {
    updateMutation.mutate({ id: editingProject.value.id, data: formData.value });
  } else {
    createMutation.mutate(formData.value);
  }
};

const getTeamName = (teamId?: string) => {
  const teamsArray = unref(teams);
  if (!teamId || !teamsArray || !Array.isArray(teamsArray) || teamsArray.length === 0) return null;
  const team = teamsArray.find((t: Team) => t.id === teamId);
  return team?.name;
};

const getProjectReleases = (projectId: string) => {
  const releasesArray = unref(releases);
  if (!releasesArray || !Array.isArray(releasesArray) || releasesArray.length === 0) return [];
  return releasesArray.filter((r: any) => r.projectId === projectId);
};

const filteredProjects = computed(() => {
  const projectsArray = unref(projects);
  
  console.log('🔍 Computing filteredProjects:', {
    projectsArray,
    projectsLength: projectsArray?.length,
    isArray: Array.isArray(projectsArray),
    type: typeof projectsArray,
  });
  
  if (!projectsArray || !Array.isArray(projectsArray) || projectsArray.length === 0) {
    console.log('⚠️ No projects to filter');
    return [];
  }
  
  const filtered = projectsArray.filter((project: Project) => {
    const matchesSearch =
      !searchQuery.value ||
      project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (project.code && project.code.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesStatus = statusFilter.value === 'all' || project.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
  
  console.log('✅ Filtered projects:', filtered.length);
  return filtered;
});

// Watch for projects data changes
watch(() => projects.value, (newVal) => {
  console.log('🔄 Projects data changed:', newVal);
}, { immediate: true, deep: true });
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
          <h1 class="text-3xl font-bold text-slate-800">{{ t('projects') }}</h1>
          <p class="text-slate-500 mt-1">{{ t('manageProjects') }}</p>
        </div>
        <Button @click="handleOpenDialog()" class="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Plus class="w-4 h-4" />
          {{ t('newProject') }}
        </Button>
      </div>

      <!-- Debug Info (Remove in production) -->
      <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs space-y-1">
        <p><strong>Debug Info:</strong></p>
        <p>isLoading: {{ isLoading }} | isFetching: {{ isFetching }} | isSuccess: {{ isSuccess }}</p>
        <p>Projects.value: {{ projects }}</p>
        <p>Projects type: {{ typeof projects }} | Is Array: {{ Array.isArray(projects) }} | Length: {{ projects?.length || 'undefined' }}</p>
        <p>Filtered count: {{ filteredProjects.length }}</p>
        <p>Error: {{ projectsError?.message || 'None' }}</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-1 max-w-md">
          <Search
            :class="`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`"
          />
          <Input
            v-model="searchQuery"
            :placeholder="t('searchProjects')"
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

      <!-- Projects Grid -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
      </div>
      <div v-else-if="filteredProjects.length === 0" class="text-center py-16">
        <FolderOpen class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-600">{{ t('noProjectsFound') }}</h3>
        <p class="text-slate-400 mt-1">{{ t('createFirstProject') }}</p>
        <Button @click="handleOpenDialog()" class="mt-4 bg-indigo-600 hover:bg-indigo-700">
          <Plus :class="`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`" />
          {{ t('createProject') }}
        </Button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]"
        >
          <Card class="hover:shadow-lg transition-shadow">
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center"
                  >
                    <FolderOpen class="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle class="text-lg">{{ project.name }}</CardTitle>
                    <p v-if="project.code" class="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <Code class="w-3 h-3" />
                      {{ project.code }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-1">
                  <Button variant="ghost" size="icon" @click="handleOpenDialog(project)">
                    <Edit class="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteMutation.mutate(project.id)">
                    <Trash2 class="w-4 h-4 text-rose-400" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p v-if="project.description" class="text-sm text-slate-500 mb-4 line-clamp-2">
                {{ project.description }}
              </p>
              <div class="flex items-center justify-between">
                <Badge :class="STATUS_CONFIG[project.status]?.color">
                  {{ STATUS_CONFIG[project.status]?.label.value }}
                </Badge>
                <div class="flex items-center gap-3 text-sm text-slate-500">
                  <div v-if="getTeamName(project.teamId)" class="flex items-center gap-1">
                    <Users class="w-4 h-4" />
                    <span>{{ getTeamName(project.teamId) }}</span>
                  </div>
                  <span>{{ getProjectReleases(project.id).length }} releases</span>
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
