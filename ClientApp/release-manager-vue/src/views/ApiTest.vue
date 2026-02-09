<script setup lang="ts">
import { ref } from 'vue';
import { base44 } from '@/api/base44Client';

const projects = ref<any>(null);
const teams = ref<any>(null);
const releases = ref<any>(null);
const items = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function testAPI() {
  loading.value = true;
  error.value = null;
  
  try {
    console.log('Testing API...');
    
    // Test Projects
    console.log('Fetching projects...');
    projects.value = await base44.entities.Project.list();
    console.log('Projects:', projects.value);
    
    // Test Teams
    console.log('Fetching teams...');
    teams.value = await base44.entities.Team.list();
    console.log('Teams:', teams.value);
    
    // Test Releases
    console.log('Fetching releases...');
    releases.value = await base44.entities.Release.list();
    console.log('Releases:', releases.value);
    
    // Test Release Items
    console.log('Fetching release items...');
    items.value = await base44.entities.ReleaseItem.list();
    console.log('Release Items:', items.value);
    
    console.log('All API tests passed!');
  } catch (e: any) {
    console.error('API Error:', e);
    error.value = e.message || 'Unknown error';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">API Diagnostic Tool</h1>
      
      <button
        @click="testAPI"
        :disabled="loading"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
      >
        {{ loading ? 'Testing...' : 'Test API' }}
      </button>
      
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
        <h3 class="font-bold text-red-800">Error:</h3>
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <div class="space-y-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-2">Projects</h2>
          <p class="text-gray-600 mb-2">Count: {{ projects?.length || 0 }}</p>
          <pre class="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">{{ JSON.stringify(projects, null, 2) }}</pre>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-2">Teams</h2>
          <p class="text-gray-600 mb-2">Count: {{ teams?.length || 0 }}</p>
          <pre class="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">{{ JSON.stringify(teams, null, 2) }}</pre>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-2">Releases</h2>
          <p class="text-gray-600 mb-2">Count: {{ releases?.length || 0 }}</p>
          <pre class="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">{{ JSON.stringify(releases, null, 2) }}</pre>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-2">Release Items</h2>
          <p class="text-gray-600 mb-2">Count: {{ items?.length || 0 }}</p>
          <pre class="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">{{ JSON.stringify(items, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
