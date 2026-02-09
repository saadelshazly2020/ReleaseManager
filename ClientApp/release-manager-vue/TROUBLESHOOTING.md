# Vue App Troubleshooting Guide

## Common Issues and Solutions

### 1. PostCSS/Tailwind CSS Import Error

**Error Message:**
```
[postcss] postcss-import: Unknown word "use strict"
@import 'tailwindcss';
```

**Solution:**
This has been fixed. The CSS imports now use the correct Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Instead of:
```css
@import 'tailwindcss';
```

If you still see this error:
1. Stop the dev server (Ctrl+C)
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart: `npm run dev`

### 2. TypeScript Import Error: "Unexpected 'type'"

**Error Message:**
```
[ERROR] Unexpected "type"
src/api/base44Client.ts:1:14:
  1 ? import axios, type { AxiosInstance } from 'axios';
```

**Solution:**
This has been fixed. The import statement has been split into two lines:
```typescript
import axios from 'axios';
import type { AxiosInstance } from 'axios';
```

If you still see this error, try:
1. Stop the dev server (Ctrl+C)
2. Delete the `node_modules/.vite` folder
3. Restart: `npm run dev`

### 2. Dependency Installation Issues

**Error:** `ERESOLVE unable to resolve dependency tree`

**Solution:**
```bash
npm install --legacy-peer-deps
```

Or clean install:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 3. Port Already in Use

**Error:** `Port 5174 is already in use`

**Solution:**
Either:
- Stop the other process using port 5174
- Change the port in `vite.config.ts`:
```typescript
server: {
  port: 5175, // Change to any available port
}
```

### 4. API Connection Issues

**Error:** `Failed to fetch` or CORS errors

**Check:**
1. Make sure the .NET API is running on `https://localhost:7295`
2. Check the proxy configuration in `vite.config.ts`
3. Verify CORS is configured in your .NET `Program.cs`:

```csharp
app.UseCors(policy => 
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());
```

### 5. Module Not Found Errors

**Error:** `Cannot find module '@/...'`

**Solution:**
1. Check that the file exists
2. Verify the path alias is correct in `vite.config.ts`
3. Try restarting the dev server

### 6. Vue DevTools Not Working

**Solution:**
1. Install the Vue DevTools browser extension
2. Or access the standalone DevTools at: `http://localhost:5174/__devtools__/`

### 7. Hot Module Replacement (HMR) Not Working

**Solution:**
1. Save the file again
2. Restart the dev server
3. Check browser console for errors

### 8. TypeScript Errors in IDE but App Runs Fine

**Solution:**
1. Restart your IDE/VSCode
2. Run: `npm run type-check`
3. Check `tsconfig.app.json` for correct paths

### 9. Tailwind CSS Styles Not Applied

**Solution:**
1. Make sure `src/assets/globals.css` is imported in `main.ts`
2. Check `tailwind.config.js` content paths
3. Restart dev server

### 10. Build Errors

**Solution:**
```bash
# Clean build
rm -rf dist
npm run build

# Type check before building
npm run type-check
npm run build
```

## Quick Reset

If nothing else works, do a complete reset:

```bash
# 1. Stop the dev server (Ctrl+C)

# 2. Clean everything
rm -rf node_modules
rm -rf .vite
rm -rf dist
rm package-lock.json

# 3. Reinstall
npm install --legacy-peer-deps

# 4. Restart
npm run dev
```

## Getting Help

1. Check the browser console for errors (F12)
2. Check the terminal for build errors
3. Verify all files are in the correct locations
4. Make sure you're in the correct directory: `ClientApp/release-manager-vue`

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Debugging
npm run type-check      # Check TypeScript errors
npm run lint            # Check code quality

# Clean
rm -rf node_modules/.vite  # Clear Vite cache
```
