# ?? Step-by-Step Diagnostic Guide

## What to Check Right Now

### Step 1: Open Projects Page
Navigate to: `http://localhost:5174/projects`

### Step 2: Look at the Yellow Debug Box

Take a screenshot or copy the exact values you see:

```
Debug Info:
isLoading: [WHAT VALUE?]
isFetching: [WHAT VALUE?]
isSuccess: [WHAT VALUE?]
Projects raw: [WHAT VALUE?]
Projects: [HOW MANY?] items
Projects is Array: [true or false?]
Projects type: [WHAT TYPE?]
Filtered: [HOW MANY?] items
Search Query: [WHAT VALUE?]
Status Filter: [WHAT VALUE?]
Error: [WHAT MESSAGE?]
```

### Step 3: Open Browser Console (F12)

Look for these specific messages and tell me what you see:

**Look for:**
1. `?? API Request: GET /projects`
2. `? API Response: 200 /projects [...]`
3. `?? Fetching projects...`
4. `?? Projects fetched: [...]`
5. `?? Projects type: [...]`
6. `?? Projects data changed: [...]`
7. `?? Computing filteredProjects: {...}`

**Copy the EXACT output you see!**

### Step 4: Check Network Tab

1. Open F12 ? Network tab
2. Refresh the page
3. Look for `/projects` request
4. Click on it
5. Check:
   - **Status:** Should be `200`
   - **Response tab:** What data is returned?
   - **Headers tab:** Check `Content-Type`

## Possible Scenarios

### Scenario A: Data is Loading But Not Displaying

**If you see:**
```
isLoading: false
isSuccess: true
Projects: 5 items
Projects is Array: true
Filtered: 0 items  ? PROBLEM HERE!
```

**This means:** Data loaded but filter is removing everything

**Check:**
- Is Search Query empty? `""`
- Is Status Filter set to "all"? 

### Scenario B: Data is Not Loading

**If you see:**
```
isLoading: true (or false)
isSuccess: false
Projects: 0 items
Projects raw: undefined (or null)
```

**This means:** API call failed or didn't complete

**Check console for:**
- Red error messages
- CORS errors
- 404 errors

### Scenario C: Wrong Data Type

**If you see:**
```
Projects is Array: false
Projects type: object (or undefined)
```

**This means:** API returned unexpected format

**Check:**
- What does `Projects raw` show?
- Is it an object instead of array?

## Quick Tests

### Test 1: Direct API Call

Open Console (F12) and run:

```javascript
fetch('/api/projects')
  .then(r => r.json())
  .then(d => {
    console.log('Direct fetch result:', d);
    console.log('Is array?', Array.isArray(d));
    console.log('Length:', d?.length);
  })
  .catch(e => console.error('Direct fetch error:', e));
```

**Tell me what this prints!**

### Test 2: Check TanStack Query Cache

Open Console and run:

```javascript
// This might work depending on your setup
console.log('Query cache:', window.__VUE_QUERY_CLIENT__);
```

### Test 3: API Test Page

Navigate to: `http://localhost:5174/api-test`

Click "Test API" and tell me:
- Does it show data?
- How many projects?
- Any errors?

## What to Report Back

Please provide:

1. **Debug Box Values** (exact text from yellow box)
2. **Console Output** (all messages starting with emoji)
3. **Network Tab** (status code and first few lines of response)
4. **Direct Fetch Test** (what did it print?)
5. **API Test Page** (did it work?)

## Common Issues & Quick Fixes

### Issue: Loading Never Stops

```
isLoading: true (stuck)
isFetching: true (stuck)
```

**Fix:**
```bash
# Clear everything and restart
rm -rf node_modules/.vite
npm run dev
```

### Issue: CORS Error in Console

```
? API Error: CORS...
```

**Fix:**
- Restart .NET API
- Verify port 5174 in Program.cs

### Issue: 404 Not Found

```
? API Error: 404
```

**Fix:**
- Check API is running
- Verify endpoint URL

### Issue: Data Format Wrong

```
Projects raw: {...} instead of [...]
```

**Fix:**
- API might be returning object instead of array
- Check Controllers/ProjectsController.cs

## Next Steps Based on What You Find

**If data loads in API Test but not in Projects page:**
? Problem is with Vue Query lifecycle

**If data doesn't load anywhere:**
? Problem is with API connection

**If data loads but filter returns 0:**
? Problem is with filter logic

**If console shows errors:**
? Tell me the exact error message

---

**Please run through these steps and report back what you find!** ??

This will help me identify the exact issue and provide a targeted fix.
