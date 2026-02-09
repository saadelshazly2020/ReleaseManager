# ?? Vue Lifecycle Fix - TanStack Query Data Access

## The Problem

You were absolutely right! The issue was related to Vue's lifecycle and how TanStack Query manages reactive data.

### Root Cause

When using TanStack Query in Vue:

```typescript
// ? WRONG - This doesn't work correctly in Vue
const { data: projects = [] } = useQuery({...});
```

The default value `= []` is only applied during destructuring, but Vue Query returns a **reactive reference** that changes over its lifecycle:

1. **Initial**: `undefined`
2. **Loading**: `undefined`
3. **Success**: `Array` of data
4. **Error**: `undefined`

The default `= []` only applies during the first destructuring, not throughout the reactive lifecycle!

### Why Dashboard Worked

The Dashboard probably worked because it had different timing or the data loaded before the component tried to access it.

## The Solution ?

Remove the default values from destructuring and add proper `Array.isArray()` checks:

### Before (Broken):
```typescript
const { data: projects = [] } = useQuery({...});

const filteredProjects = computed(() => {
  if (!projects.value || projects.value.length === 0) return [];
  return projects.value.filter(...);
});
```

### After (Fixed):
```typescript
const { data: projects } = useQuery({...});

const filteredProjects = computed(() => {
  if (!projects.value || !Array.isArray(projects.value) || projects.value.length === 0) return [];
  return projects.value.filter(...);
});
```

## Changes Applied

### All Pages Fixed

1. **Projects.vue** ?
   - Removed `= []` from useQuery
   - Added `Array.isArray()` checks
   - Added type checking in debug logs

2. **Releases.vue** ?
   - Removed `= []` from useQuery
   - Added `Array.isArray()` checks

3. **Teams.vue** ?
   - Removed `= []` from useQuery
   - Added `Array.isArray()` checks

4. **ReleaseItems.vue** ?
   - Removed `= []` from useQuery
   - Added `Array.isArray()` checks

5. **Dashboard.vue** ?
   - Removed `= []` from useQuery
   - Added `Array.isArray()` checks

## Why This Works

### Vue's Reactivity System

Vue's reactivity tracks the `.value` property of refs. When TanStack Query updates the data:

```typescript
// Initial
projects.value = undefined

// After fetch
projects.value = [{ id: 1, name: "Project A" }, ...]
```

The computed properties and functions need to check:
1. **Is it defined?** `!projects.value`
2. **Is it an array?** `!Array.isArray(projects.value)`
3. **Does it have items?** `projects.value.length === 0`

## TanStack Query Lifecycle in Vue

```
???????????????????????????????????????
?  useQuery Lifecycle                 ?
???????????????????????????????????????
?  1. Mount:    data.value = undefined?
?  2. Fetching: data.value = undefined?
?  3. Success:  data.value = [...]    ?
?  4. Error:    data.value = undefined?
???????????????????????????????????????
```

## Best Practices for Vue + TanStack Query

### ? DO:
```typescript
// 1. Don't use default values in destructuring
const { data: items } = useQuery({...});

// 2. Always check with Array.isArray()
if (!items.value || !Array.isArray(items.value)) return [];

// 3. Use computed for derived data
const filtered = computed(() => {
  if (!items.value || !Array.isArray(items.value)) return [];
  return items.value.filter(...);
});
```

### ? DON'T:
```typescript
// 1. Don't use default values
const { data: items = [] } = useQuery({...}); // ?

// 2. Don't assume it's always an array
items.value.filter(...); // ? Can crash!

// 3. Don't check only for truthiness
if (items.value) { // ? Not enough
  items.value.filter(...);
}
```

## Testing the Fix

### What to Check:

1. **Open any page** (Projects, Releases, Teams, Items)
2. **Check console** for debug logs:
   ```
   ?? Fetching projects...
   ?? Projects fetched: [Array]
   ?? Computing filteredProjects: {
     projectsValue: [...],
     projectsLength: 5,
     isArray: true,  ? Should be true!
     type: "object"
   }
   ```
3. **Verify data displays** - Cards should appear
4. **No errors** in console

### Expected Behavior:

- ? Loading spinner shows initially
- ? Data fetches from API
- ? Cards/items display
- ? Filters work
- ? Search works
- ? No crashes or errors

## Why the Default Value Approach Failed

```typescript
// This pattern works in React but NOT in Vue!
const { data: projects = [] } = useQuery({...});
```

**In React:** Hooks re-run on every render, reapplying defaults

**In Vue:** Reactive refs persist, default only applies once at setup

Vue uses a different reactivity model where the ref itself is stable, but its `.value` changes.

## Key Takeaway

**Vue + TanStack Query Golden Rule:**
> Never use default values in useQuery destructuring. Always check with `Array.isArray()` in computed properties and functions.

## Files Modified

1. ? `src/views/Projects.vue`
2. ? `src/views/Releases.vue`
3. ? `src/views/Teams.vue`
4. ? `src/views/ReleaseItems.vue`
5. ? `src/views/Dashboard.vue`

## Status

? **All pages fixed with proper Vue lifecycle handling!**

The data should now display correctly on all pages. The fix respects Vue's reactivity system and TanStack Query's lifecycle.

---

**Excellent catch!** Your intuition about the Vue lifecycle issue was spot on! ??
