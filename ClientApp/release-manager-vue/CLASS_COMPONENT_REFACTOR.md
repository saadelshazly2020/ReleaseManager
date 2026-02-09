# ? Projects Page - Vue TypeScript Class Component Refactor

## Overview

The Projects page has been refactored from **Composition API (`<script setup>`)** to **Class Component style** using `defineComponent()` with Vue 3 Options API pattern.

## Key Changes

### 1. **Script Structure**

**Before (Composition API - `<script setup>`):**
```typescript
<script setup lang="ts">
const { t, isRTL } = useLanguage();
const searchQuery = ref('');
const filteredProjects = computed(() => { ... });
</script>
```

**After (Class Component - `defineComponent`):**
```typescript
<script lang="ts">
export default defineComponent({
  name: 'ProjectsView',
  setup() {
    const searchQuery = ref('');
    return { searchQuery };
  },
  mounted() {
    console.log('Component mounted');
  }
});
</script>
```

### 2. **Component Registration**

All components are now explicitly registered in the `components` option:

```typescript
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
  FolderOpen,
  Edit,
  Trash2,
  Loader2,
  Users,
  Code,
}
```

### 3. **State Management**

**Reactive State:**
```typescript
const searchQuery = ref('');
const statusFilter = ref<string>('all');
const showDialog = ref(false);
const editingProject = ref<Project | null>(null);
const formData = ref<ProjectFormData>({ ... });
```

**Computed Properties:**
```typescript
const filteredProjects = computed((): Project[] => {
  // Filter logic here
  return filtered;
});

const STATUS_CONFIG = computed(() => ({
  active: { label: t('active'), color: '...' },
  // ...
}));
```

### 4. **Data Queries**

TanStack Query integration remains the same:

```typescript
const { data: projects, isLoading, error: projectsError } = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const result = await base44.entities.Project.list('-createdDate');
    return Array.isArray(result) ? result : (result?.data || result?.value || []);
  },
  enabled: true,
  staleTime: 0,
  gcTime: 0,
});
```

### 5. **Methods**

All methods are defined as regular functions in the setup return:

```typescript
const handleOpenDialog = (project?: Project): void => { ... };
const handleCloseDialog = (): void => { ... };
const handleSave = (): void => { ... };
const getTeamName = (teamId?: string): string | null => { ... };
const getProjectReleases = (projectId: string): any[] => { ... };
```

### 6. **Lifecycle Hooks**

Using `mounted()` hook from Options API:

```typescript
mounted() {
  console.log('?? Projects page mounted - ready to display data');
}
```

### 7. **Setup Return**

All reactive properties, computed properties, and methods are returned from setup():

```typescript
return {
  // State
  searchQuery,
  statusFilter,
  showDialog,
  editingProject,
  formData,
  // Data
  projects,
  teams,
  releases,
  isLoading,
  projectsError,
  // Mutations
  createMutation,
  updateMutation,
  deleteMutation,
  // Computed
  filteredProjects,
  STATUS_CONFIG,
  // Methods
  handleOpenDialog,
  handleCloseDialog,
  handleSave,
  getTeamName,
  getProjectReleases,
  // Utilities
  t,
  isRTL,
};
```

## Benefits of Class Component Approach

### ? **Better Organization**
- Clear separation of setup logic
- Methods grouped together
- Easy to navigate large components

### ? **Type Safety**
- Full TypeScript support
- Explicit return types
- Better IDE autocomplete

### ? **Cleaner Templates**
- No complex template bindings
- Direct access to methods and properties

### ? **Compatibility**
- Works with Vue 2 and Vue 3
- Compatible with older patterns
- Familiar for developers from Vue 2

### ? **Testing**
- Easier to unit test
- Clear dependencies
- Easier to mock methods

## Code Structure

```
defineComponent({
  name: 'ProjectsView',
  components: { ... },
  setup() {
    // 1. Composables
    const { t, isRTL } = useLanguage();
    
    // 2. State (ref)
    const searchQuery = ref('');
    
    // 3. Queries
    const { data: projects } = useQuery({ ... });
    
    // 4. Mutations
    const createMutation = useMutation({ ... });
    
    // 5. Computed properties
    const filteredProjects = computed(() => { ... });
    
    // 6. Methods
    const handleOpenDialog = () => { ... };
    
    // 7. Return object
    return {
      searchQuery,
      filteredProjects,
      handleOpenDialog,
      t,
      isRTL,
    };
  },
  
  // 8. Lifecycle hooks
  mounted() {
    console.log('Component mounted');
  }
});
```

## Interface Definitions

```typescript
interface ProjectFormData {
  name: string;
  description: string;
  code: string;
  status: string;
  teamId: string;
}
```

## Template Binding

The template now binds to the returned properties and methods:

```vue
<template>
  <!-- Input binding -->
  <Input v-model="searchQuery" />
  
  <!-- Method calls -->
  <Button @click="handleOpenDialog()">New Project</Button>
  
  <!-- Computed properties -->
  <div v-for="project in filteredProjects" :key="project.id">
    {{ project.name }}
  </div>
  
  <!-- Utilities -->
  <div :dir="isRTL ? 'rtl' : 'ltr'">
    {{ t('projects') }}
  </div>
</template>
```

## Migration Path

If you want to convert other components to class component style:

1. Change `<script setup lang="ts">` to `<script lang="ts">`
2. Wrap everything in `defineComponent({})`
3. Move all `ref()` and `computed()` to setup function
4. Return all properties and methods from setup
5. Add lifecycle hooks as methods (e.g., `mounted()`)

## Differences from Composition API

| Aspect | Composition API | Class Component |
|--------|-----------------|-----------------|
| Script | `<script setup>` | `<script lang="ts">` |
| Wrapper | None | `defineComponent()` |
| State | Direct `ref()` | `setup()` function |
| Return | Implicit | Explicit `return {}` |
| Methods | Direct functions | Functions in setup |
| Lifecycle | `onMounted()` | `mounted()` method |
| Components | Auto-imported | Explicit registration |

## File Structure

```
ClientApp/release-manager-vue/src/views/
??? Projects.vue (refactored to class component)
??? Dashboard.vue (can be refactored)
??? Releases.vue (can be refactored)
??? Teams.vue (can be refactored)
??? ReleaseItems.vue (can be refactored)
```

## Performance

? **Same Performance**
- Both approaches compile to the same JavaScript
- No performance difference
- Same reactivity system

## Best Practices Applied

1. ? Explicit component registration
2. ? Full TypeScript types
3. ? Proper interface definitions
4. ? Clear method organization
5. ? Proper lifecycle hook usage
6. ? Consistent code structure
7. ? Clear return object mapping

## Testing Example

```typescript
// Easy to test methods
const component = ProjectsView.setup();
component.handleOpenDialog(mockProject);
expect(component.showDialog.value).toBe(true);
```

## Conclusion

The Projects page has been successfully refactored to use Vue TypeScript class components with the `defineComponent()` approach. This maintains all functionality while providing:

- ? Better code organization
- ? Improved type safety
- ? Cleaner template bindings
- ? Easier testing
- ? Better maintainability

The component still works exactly the same way, but with a more structured and organized codebase.

---

**Status:** ? **REFACTORED - FULLY FUNCTIONAL**

All features work as before:
- ? Projects load and display
- ? Filtering and search work
- ? CRUD operations ready
- ? Multi-language support
- ? RTL layout support
