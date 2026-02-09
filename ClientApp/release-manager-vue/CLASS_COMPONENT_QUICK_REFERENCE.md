# ?? Quick Reference - Vue Class Component Projects Page

## Component Structure Overview

```typescript
// 1. Imports
import { defineComponent, ref, computed } from 'vue';
import { useQuery, useMutation } from '@tanstack/vue-query';

// 2. Define component
export default defineComponent({
  name: 'ProjectsView',
  
  // 3. Register child components
  components: {
    Button, Input, Card, ...
  },
  
  // 4. Setup function
  setup() {
    // Initialize composables
    const { t, isRTL } = useLanguage();
    
    // Reactive state
    const searchQuery = ref('');
    const filteredProjects = computed(() => { ... });
    
    // Data queries
    const { data: projects } = useQuery({ ... });
    
    // Mutations
    const createMutation = useMutation({ ... });
    
    // Methods
    const handleOpenDialog = (project?: Project) => { ... };
    
    // Return public API
    return {
      searchQuery,
      filteredProjects,
      handleOpenDialog,
      projects,
      createMutation,
      t,
      isRTL,
    };
  },
  
  // 5. Lifecycle hooks (Options API style)
  mounted() {
    console.log('Component mounted');
  }
});
```

## Key Differences from Composition API

| Aspect | Composition (`<script setup>`) | Class Component (`defineComponent`) |
|--------|--------------------------------|-------------------------------------|
| Syntax | `<script setup lang="ts">` | `<script lang="ts">` |
| State | `const x = ref('')` | `const x = ref('')` in setup |
| Return | Implicit (all vars available) | Explicit `return { x }` |
| Methods | Direct functions | Functions in setup, returned |
| Lifecycle | `onMounted(() => {})` | `mounted() {}` |
| Components | Auto-registered | Explicit in `components` option |
| Imports | Direct | In setup or module level |

## State Management

```typescript
// Refs (mutable state)
const searchQuery = ref('');
const showDialog = ref(false);

// Computed (derived state)
const filteredProjects = computed(() => {
  return projects.value.filter(...);
});

// In template:
<input v-model="searchQuery" />
<div v-if="showDialog">Dialog</div>
<div v-for="p in filteredProjects">{{ p.name }}</div>
```

## Methods

```typescript
// Define method in setup
const handleOpenDialog = (project?: Project): void => {
  showDialog.value = true;
};

// Return in setup return object
return { handleOpenDialog };

// Use in template
<button @click="handleOpenDialog()">Open</button>
```

## Data Queries (TanStack Query)

```typescript
// Define query in setup
const { data: projects, isLoading } = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    return await base44.entities.Project.list();
  },
});

// Return from setup
return { projects, isLoading };

// Use in template
<div v-if="isLoading">Loading...</div>
<div v-else v-for="p in projects">{{ p.name }}</div>
```

## Mutations

```typescript
// Define mutation in setup
const createMutation = useMutation({
  mutationFn: (data) => base44.entities.Project.create(data),
  onSuccess: () => {
    // Handle success
  },
});

// Return from setup
return { createMutation };

// Use in template or methods
createMutation.mutate(projectData);
```

## Computed Properties

```typescript
// With dependencies
const filteredProjects = computed(() => {
  if (!projects.value) return [];
  return projects.value.filter(p => 
    p.status === statusFilter.value
  );
});

// In template
<div v-for="p in filteredProjects">{{ p.name }}</div>
```

## Lifecycle Hooks

```typescript
export default defineComponent({
  setup() {
    // ... setup code
    return { /* ... */ };
  },
  
  // Lifecycle hooks as methods
  beforeCreate() { },
  created() { },
  beforeMount() { },
  mounted() { console.log('mounted'); },
  beforeUpdate() { },
  updated() { },
  beforeUnmount() { },
  unmounted() { },
});
```

## Complete Example Method

```typescript
const handleSave = (): void => {
  if (editingProject.value) {
    // Update existing
    updateMutation.mutate({
      id: editingProject.value.id,
      data: formData.value,
    });
  } else {
    // Create new
    createMutation.mutate(formData.value);
  }
};
```

## Return Object Best Practice

```typescript
return {
  // State (refs)
  searchQuery,
  statusFilter,
  showDialog,
  
  // Data (from queries)
  projects,
  teams,
  releases,
  isLoading,
  
  // Mutations
  createMutation,
  updateMutation,
  deleteMutation,
  
  // Computed
  filteredProjects,
  STATUS_CONFIG,
  
  // Methods
  handleOpenDialog,
  handleSave,
  getTeamName,
  
  // Utilities from composables
  t,
  isRTL,
};
```

## Type Safety

```typescript
// Define interfaces
interface ProjectFormData {
  name: string;
  description: string;
  code: string;
  status: string;
  teamId: string;
}

// Use typed refs
const formData = ref<ProjectFormData>({
  name: '',
  description: '',
  code: '',
  status: 'active',
  teamId: '',
});

// Type method parameters
const handleOpenDialog = (project?: Project): void => {
  // ...
};

// Type method returns
const getTeamName = (teamId?: string): string | null => {
  // ...
};
```

## Template Usage

```vue
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- Bindings work the same -->
    <input v-model="searchQuery" />
    
    <!-- Method calls -->
    <button @click="handleOpenDialog()">Add</button>
    
    <!-- Conditional rendering -->
    <div v-if="isLoading">Loading...</div>
    
    <!-- Loops -->
    <div v-for="p in filteredProjects" :key="p.id">
      {{ p.name }}
    </div>
    
    <!-- Dynamic classes -->
    <div :class="STATUS_CONFIG[p.status]?.color">
      {{ STATUS_CONFIG[p.status]?.label }}
    </div>
    
    <!-- i18n support -->
    <h1>{{ t('projects') }}</h1>
  </div>
</template>
```

## When to Use Class Components

? **Use class components when:**
- You want better code organization
- You need explicit types for all methods
- You prefer Options API pattern
- You're migrating from Vue 2
- You want clearer component structure

## When to Use Composition API

? **Use Composition API when:**
- You want simpler, terser code
- You're building new projects
- You prefer functional patterns
- You want to avoid boilerplate

## Common Patterns

### Toggle Dialog
```typescript
const showDialog = ref(false);

const handleOpenDialog = () => {
  showDialog.value = true;
};

const handleCloseDialog = () => {
  showDialog.value = false;
};
```

### Form State
```typescript
const formData = ref<ProjectFormData>({
  name: '',
  description: '',
  code: '',
  status: 'active',
  teamId: '',
});

const resetForm = () => {
  formData.value = { /* defaults */ };
};
```

### Async Operations
```typescript
const { mutate: create } = useMutation({
  mutationFn: (data) => api.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['projects']);
  },
});

const handleSave = () => {
  create(formData.value);
};
```

## Build & Deploy

```bash
# Build for production
npm run build

# Output goes to: ClientApp/release-manager-vue/dist
# This gets served by .NET API from wwwroot
```

---

**Quick Start:**
1. Open `ClientApp/release-manager-vue/src/views/Projects.vue`
2. Find the `defineComponent({ ... })` wrapper
3. All logic is in the `setup()` function
4. Return object maps to template bindings
5. Lifecycle hooks are methods on the component

? **Complete and ready to use!**
