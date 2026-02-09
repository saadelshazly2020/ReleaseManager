# Installation Guide for Vue Client

## Prerequisites
- Node.js 20.x or later
- npm or yarn

## Installation Steps

### 1. Navigate to the Vue project directory
```bash
cd ClientApp/release-manager-vue
```

### 2. Install dependencies

**Important:** Due to peer dependency requirements, use the `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

Or if you prefer to force installation:

```bash
npm install --force
```

### 3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## Dependencies to Install

The following packages are required:

### Core Dependencies
- vue@^3.5.27
- vue-router@^5.0.1
- axios@^1.6.7
- @tanstack/vue-query@^5.28.0
- pinia@^3.0.4 (updated to v3 for compatibility with vue-router@5)

### UI Libraries
- radix-vue@^1.9.0
- lucide-vue-next@^0.356.0
- class-variance-authority@^0.7.0
- clsx@^2.1.0
- tailwind-merge@^2.2.1

### Dev Dependencies
- @vitejs/plugin-vue-jsx@^3.1.0
- tailwindcss@^3.4.1
- autoprefixer@^10.4.18
- postcss@^8.4.35
- tailwindcss-animate@^1.0.7
- typescript@~5.9.3

## Configuration Files Created

1. ? `vite.config.ts` - Vite configuration with API proxy and esbuild settings
2. ? `tailwind.config.js` - Tailwind CSS configuration
3. ? `postcss.config.js` - PostCSS configuration
4. ? `src/assets/globals.css` - Global styles with Tailwind directives and CSS variables
5. ? `src/api/base44Client.ts` - API client with proper TypeScript imports
6. ? `src/lib/utils.ts` - Utility functions
7. ? `src/composables/useLanguage.ts` - Language composable
8. ? `src/composables/translations.ts` - Translation definitions

**Note:** The CSS file uses standard Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`) instead of the newer `@import 'tailwindcss'` syntax for better compatibility.

## UI Components Created

1. ? `Button.vue` - Button component with variants
2. ? `Input.vue` - Input component
3. ? `Card.vue` - Card container
4. ? `CardHeader.vue` - Card header
5. ? `CardTitle.vue` - Card title
6. ? `CardContent.vue` - Card content
7. ? `Badge.vue` - Badge component with variants

## Pages Created

1. ? **Dashboard.vue** - Overview with stats, status distribution, upcoming releases, and team workload
2. ? **Releases.vue** - Complete release management with filtering and CRUD operations
3. ? **Projects.vue** - Project listing and management with team assignments
4. ? **Teams.vue** - Team management with member counts and custom colors
5. ? **ReleaseItems.vue** - Track features, bugs, improvements, and other release items

## Components Created

1. ? **Layout.vue** - Main layout with responsive navigation and language switcher

## Features Implemented

- ? TypeScript support
- ? Vue Router setup
- ? TanStack Query for data fetching
- ? Tailwind CSS styling
- ? Multi-language support (EN/AR)
- ? RTL support
- ? API integration with proxy
- ? Responsive design
- ? Loading states
- ? Error handling
- ? CRUD operations for Projects

## Next Steps

1. Install dependencies:
```bash
cd ClientApp/release-manager-vue
npm install --legacy-peer-deps
```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5174`

4. The app will connect to your API at `https://localhost:7295/api` (configured in vite.config.ts)

## Additional Pages to Create

You can create additional pages similar to the React app:
- Dashboard (with charts and statistics)
- Releases (release management)
- Release Items (feature/bug tracking)
- Teams (team management)
- Release Details (detailed release view)

## Troubleshooting

### Dependency Conflicts

If you see peer dependency errors like `ERESOLVE unable to resolve dependency tree`, use one of these solutions:

```bash
# Option 1: Use legacy peer deps (recommended)
npm install --legacy-peer-deps

# Option 2: Force installation
npm install --force

# Option 3: Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Other Issues

1. Make sure Node.js version is 20.x or later
2. Delete `node_modules` and `package-lock.json`, then run `npm install --legacy-peer-deps` again
3. Make sure the API is running on `https://localhost:7295`
4. Check the browser console for any errors

## Development

- Hot Module Replacement (HMR) is enabled
- TypeScript type checking: `npm run type-check`
- Linting: `npm run lint`
- Building: `npm run build`
