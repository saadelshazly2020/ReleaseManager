<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { base44, type Team } from '@/api/base44Client';
import { useLanguage } from '@/composables/useLanguage';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import { Search, Plus, Users, Edit, Trash2, Loader2, User } from 'lucide-vue-next';

export default defineComponent({
  name: 'TeamsView',
  components: {
    Button,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Search,
    Plus,
    Users,
    Edit,
    Trash2,
    Loader2,
    User,
  },

  setup() {
    const { t, isRTL } = useLanguage();
    const queryClient = useQueryClient();

    const searchQuery = ref('');

    const { data: teams, isLoading } = useQuery({
      queryKey: ['teams'],
      queryFn: async () => {
        const result = await base44.entities.Team.list();
        return Array.isArray(result) ? result : (result?.data || result?.value || []);
      },
      enabled: true,
      staleTime: 0,
      gcTime: 0,
    });

    const deleteMutation = useMutation({
      mutationFn: (id: string) => base44.entities.Team.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teams'] });
      },
    });

    const filteredTeams = computed((): Team[] => {
      if (!teams.value || !Array.isArray(teams.value) || teams.value.length === 0) {
        return [];
      }
      
      return teams.value.filter((team: Team) => {
        const matchesSearch =
          !searchQuery.value ||
          team.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (team.lead && team.lead.toLowerCase().includes(searchQuery.value.toLowerCase()));
        return matchesSearch;
      });
    });

    return {
      // State
      searchQuery,
      // Data
      teams,
      isLoading,
      // Mutations
      deleteMutation,
      // Computed
      filteredTeams,
      // Utilities
      t,
      isRTL,
    };
  },

  mounted() {
    console.log('🎯 Teams page mounted - ready to display data');
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
          <h1 class="text-3xl font-bold text-slate-800">{{ t('teams') }}</h1>
          <p class="text-slate-500 mt-1">{{ t('manageTeams') }}</p>
        </div>
        <Button class="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Plus class="w-4 h-4" />
          {{ t('newTeam') }}
        </Button>
      </div>

      <!-- Search -->
      <div class="relative max-w-md mb-6">
        <Search
          :class="`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`"
        />
        <Input
          v-model="searchQuery"
          :placeholder="t('searchTeams')"
          :class="isRTL ? 'pr-10' : 'pl-10'"
        />
      </div>

      <!-- Teams Grid -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
      </div>
      <div v-else-if="filteredTeams.length === 0" class="text-center py-16">
        <Users class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-600">{{ t('noTeamsFound') }}</h3>
        <p class="text-slate-400 mt-1">{{ t('createFirstTeam') }}</p>
        <Button class="mt-4 bg-indigo-600 hover:bg-indigo-700">
          <Plus :class="`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`" />
          {{ t('createTeam') }}
        </Button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="team in filteredTeams"
          :key="team.id"
          class="fade-in-card"
        >
          <Card class="hover:shadow-lg transition-shadow">
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :style="{ backgroundColor: team.color || '#6366f1' }"
                  >
                    <Users class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle class="text-lg">{{ team.name }}</CardTitle>
                    <p v-if="team.lead" class="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <User class="w-3 h-3" />
                      {{ team.lead }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit class="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteMutation.mutate(team.id)">
                    <Trash2 class="w-4 h-4 text-rose-400" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p v-if="team.description" class="text-sm text-slate-500 mb-4 line-clamp-2">
                {{ team.description }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-slate-600">
                  <Users class="w-4 h-4" />
                  <span>{{ team.membersCount }} {{ t('members') }}</span>
                </div>
                <div
                  v-if="team.color"
                  class="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  :style="{ backgroundColor: team.color }"
                ></div>
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

.fade-in-card {
  animation: fadeIn 0.3s ease-in forwards;
}
</style>
