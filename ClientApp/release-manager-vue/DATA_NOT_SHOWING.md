# ?? Data Not Showing - Troubleshooting Guide

## Current Status
- ? Dashboard is showing data
- ? Other pages (Projects, Releases, Teams, Items) not showing data

## Diagnostic Steps

### Step 1: Check API Test Page

I've created a diagnostic page to test the API directly.

**Access it:** `http://localhost:5174/api-test`

Click "Test API" and check:
1. Does it load data?
2. Are there any errors?
3. What does the console show?

### Step 2: Check Browser Console

Open the Projects page and check console (F12):

**Look for:**
```
?? Fetching projects...
?? Projects fetched: [Array]
?? Computing filteredProjects: {...}
```

**Check for errors:**
- Red error messages
- Failed network requests
- 404 or 500 errors

### Step 3: Check Network Tab

Open F12 ? Network tab:

1. Go to Projects page
2. Look for `/api/projects` request
3. Check:
   - Status code (should be 200)
   - Response data
   - Response headers

### Step 4: Check Debug Info

The Projects page now shows debug info at the top:

```
Debug Info:
Loading: true/false
Projects: X items
Projects is Array: true/false
Filtered: X items
Error: None/Error message
```

## Common Issues & Solutions

### Issue 1: Data Loads but Doesn't Display

**Symptoms:**
- Console shows data fetched
- Debug info shows items count
- But no cards appear

**Solution:**
Check if `filteredProjects` is returning empty array due to filters.

Try:
1. Clear search box
2. Set status filter to "All Status"

### Issue 2: Query Returns Empty Array

**Symptoms:**
- `?? Projects fetched: []`
- No errors
- API returns empty array

**Possible Causes:**
1. Database is empty (no seed data)
2. API endpoint works but returns no data

**Solution:**
```bash
# Re-seed database
dotnet ef database drop
dotnet ef database update
# Restart API
```

### Issue 3: Query Fails Silently

**Symptoms:**
- No console logs
- `projects.value` is undefined
- Loading never completes

**Solution:**
Check TanStack Query configuration in `main.ts`:

```typescript
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5000,
      },
    },
  },
});
```

### Issue 4: Wrong Endpoint

**Symptoms:**
- 404 errors in console
- API shows "Not Found"

**Check:**
1. API endpoint names match:
   - `/api/projects` ?
   - `/api/teams` ?
   - `/api/releases` ?
   - `/api/releaseitems` ?

2. Controller routes are correct:
```csharp
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
```

### Issue 5: Data Format Mismatch

**Symptoms:**
- Data loads
- But properties don't match
- TypeScript errors

**Check:**
API returns camelCase:
```json
{
  "id": "...",
  "name": "...",
  "createdDate": "..."  // ? camelCase
}
```

Not PascalCase:
```json
{
  "Id": "...",
  "Name": "...",
  "CreatedDate": "..."  // ? PascalCase
}
```

## Quick Fixes

### Fix 1: Force Refresh

```bash
# Clear all caches
rm -rf node_modules/.vite
rm -rf node_modules/.cache

# Restart
npm run dev
```

### Fix 2: Reset TanStack Query Cache

Add to any page temporarily:

```typescript
import { useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient();

// Call this to clear cache
queryClient.clear();
```

### Fix 3: Check VueQuery Setup

Verify `main.ts` has:

```typescript
import { VueQueryPlugin } from '@tanstack/vue-query';

app.use(VueQueryPlugin);
```

## Debugging Commands

### Check if API responds directly

```bash
# Windows PowerShell
Invoke-WebRequest -Uri https://localhost:7295/api/projects -SkipCertificateCheck | Select-Object -ExpandProperty Content

# Or in browser
https://localhost:7295/api/projects
```

### Check from Vue app console

```javascript
// In browser console on http://localhost:5174
fetch('/api/projects')
  .then(r => r.json())
  .then(d => console.table(d))
  .catch(e => console.error(e));
```

## What to Report

If issues persist, provide:

1. **Console output** (full logs)
2. **Network tab** screenshot
3. **Debug info** values
4. **API test page** results
5. **Browser** and version
6. **Error messages** (if any)

## Next Steps

1. **Visit:** `http://localhost:5174/api-test`
2. **Click:** "Test API"
3. **Check:** Console for logs
4. **Report:** What you see

## Files to Check

- `src/views/Projects.vue` - Now has debug logging
- `src/views/ApiTest.vue` - New diagnostic page
- `src/api/base44Client.ts` - Has interceptors logging

## Success Indicators

When working:
- ? Console shows `?? Projects fetched: [Array of 3+ items]`
- ? Debug info shows `Projects: 3 items`
- ? Debug info shows `Filtered: 3 items`
- ? Cards appear on page
- ? No errors in console

---

**Important:** The debug info and API test page are temporary debugging tools. Remove them once issue is resolved!
