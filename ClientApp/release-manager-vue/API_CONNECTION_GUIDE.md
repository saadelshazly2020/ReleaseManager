# Vue App - API Connection Guide

## Issues Fixed

### 1. CORS Configuration
? Added Vue app port (5174) to CORS policy in `Program.cs`

### 2. JSON Serialization
? Configured camelCase property naming to match TypeScript interfaces

## Required Steps

### 1. Restart the .NET API

**Stop the API** (if running) and restart it to apply the changes:

```bash
# Stop the API (Ctrl+C in terminal)
# Then restart
dotnet run
```

Or in Visual Studio:
- Stop debugging (Shift+F5)
- Start again (F5)

### 2. Verify API is Running

Make sure your API is running on `https://localhost:7295`

Test in browser or Postman:
```
https://localhost:7295/api/projects
```

You should see JSON response with camelCase properties:
```json
[
  {
    "id": "guid-here",
    "name": "Project Name",
    "createdDate": "2024-01-01T00:00:00",
    ...
  }
]
```

### 3. Check Vue App

The Vue app should now display data. Open browser console (F12) to check for errors.

## Troubleshooting

### No Data Displayed

1. **Check Browser Console** (F12 ? Console tab)
   - Look for CORS errors
   - Look for network errors
   - Look for 404 errors

2. **Check Network Tab** (F12 ? Network tab)
   - Filter by XHR/Fetch
   - Check if API calls are being made
   - Check response status codes
   - Check response data format

3. **Verify API Endpoint**
   ```
   Vue App: http://localhost:5174
   API: https://localhost:7295/api
   ```

### CORS Errors

If you see CORS errors in console:

```
Access to XMLHttpRequest at 'https://localhost:7295/api/projects' 
from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Solution:**
1. Verify `Program.cs` includes port 5174:
   ```csharp
   policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5174")
   ```
2. Restart the .NET API

### SSL Certificate Errors

If you see SSL certificate errors:

**Solution:**
1. Trust the .NET dev certificate:
   ```bash
   dotnet dev-certs https --trust
   ```
2. Restart the API

### Property Name Mismatch

If data loads but displays incorrectly:

**Check:**
1. API returns camelCase properties
2. TypeScript interfaces match API response
3. No typos in property names

### API Not Starting

If API won't start:

1. Check if port 7295 is in use
2. Check `appsettings.json` database connection
3. Check migrations are applied:
   ```bash
   dotnet ef database update
   ```

## Verification Checklist

- [ ] .NET API is running on https://localhost:7295
- [ ] Vue app is running on http://localhost:5174
- [ ] CORS includes port 5174
- [ ] JSON returns camelCase properties
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Data displays in Vue app

## Quick Test

### 1. Test API Directly

Open in browser:
```
https://localhost:7295/api/projects
```

Should return JSON with projects.

### 2. Test from Vue App

Open browser console in Vue app (http://localhost:5174) and run:

```javascript
fetch('https://localhost:7295/api/projects')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

Should log projects data.

## Common Error Messages

### "Failed to fetch"
- API is not running
- Wrong API URL
- CORS not configured

### "NetworkError"
- SSL certificate not trusted
- Firewall blocking connection
- API crashed

### "404 Not Found"
- Wrong endpoint URL
- Controller route mismatch
- API not started

### "500 Internal Server Error"
- Database connection issue
- API code error
- Check API logs

## Debug Mode

### Enable Detailed Logging

In Vue app, add to `base44Client.ts`:

```typescript
api.interceptors.request.use(request => {
  console.log('API Request:', request.url, request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);
```

## Need More Help?

1. Check the .NET API logs
2. Check Vue app browser console
3. Check Network tab for failed requests
4. Verify all services are running
5. Try restarting both API and Vue app

## Success Indicators

When everything works:
- ? Dashboard shows statistics
- ? Projects page shows project cards
- ? Teams page shows teams
- ? Releases page shows releases
- ? No console errors
- ? Network tab shows 200 status codes
