# release-manager-vue

# Release Manager Vue App

A modern, full-featured Vue 3 + TypeScript client application for the Release Manager API.

## ? Completed Features

### Pages
- ? **Dashboard** - Overview with stats, charts, and upcoming releases
- ? **Releases** - Manage software releases with status tracking
- ? **Projects** - Project management with team assignments
- ? **Teams** - Team management with member counts
- ? **Release Items** - Track features, bugs, and improvements

### Features
- ? Vue 3 with Composition API & `<script setup>`
- ? TypeScript for full type safety
- ? Vue Router for navigation
- ? TanStack Query (Vue Query) for data fetching
- ? Tailwind CSS for styling
- ? Radix Vue for accessible UI components
- ? Lucide Vue for beautiful icons
- ? Multi-language support (English & Arabic)
- ? RTL (Right-to-Left) support
- ? Responsive design
- ? Dark mode ready (CSS variables configured)
- ? Loading states & error handling
- ? CRUD operations for all entities

## ?? Getting Started

### Prerequisites
- Node.js 20.x or later
- npm or yarn
- .NET 8 API running on `https://localhost:7295`

### Installation

```bash
# Navigate to the project
cd ClientApp/release-manager-vue

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The app will be available at `http://localhost:5174`

### Quick Start (Using Scripts)

**Windows:**
```sh
.\install-vue-app.bat
```

**macOS/Linux:**
```sh
chmod +x install-vue-app.sh
./install-vue-app.sh
```

## ?? Project Structure

```
src/
??? api/                    # API client and TypeScript interfaces
?   ??? base44Client.ts    # Main API client with entity types
??? assets/                 # Global styles
?   ??? globals.css        # Tailwind + CSS variables
??? components/             # Reusable components
?   ??? ui/                # Base UI components
?   ?   ??? Button.vue
?   ?   ??? Input.vue
?   ?   ??? Card.vue
?   ?   ??? Badge.vue
?   ?   ??? ...
?   ??? Layout.vue         # Main layout with navigation
??? composables/            # Vue composables
?   ??? useLanguage.ts     # Language switching
?   ??? translations.ts    # Translation definitions
??? lib/                    # Utility functions
?   ??? utils.ts           # cn() for className merging
??? router/                 # Vue Router configuration
?   ??? index.ts
??? views/                  # Page components
?   ??? Dashboard.vue      # Dashboard with stats & charts
?   ??? Releases.vue       # Releases management
?   ??? Projects.vue       # Projects management
?   ??? Teams.vue          # Teams management
?   ??? ReleaseItems.vue   # Release items tracking
??? App.vue                 # Root component
??? main.ts                 # Application entry point
```

## ?? UI Components

All components are built with:
- **Accessibility** - ARIA attributes and keyboard navigation
- **Type Safety** - Full TypeScript support
- **Consistency** - Unified design system
- **Responsiveness** - Mobile-first design

### Available Components
- Button (with variants: default, destructive, outline, ghost, link)
- Input
- Card, CardHeader, CardTitle, CardContent
- Badge (with variants)
- And more...

## ?? Multi-Language Support

Switch between English and Arabic with full RTL support:

```typescript
const { t, isRTL, setLanguage } = useLanguage();

// Use in template
{{ t('dashboard') }}

// Change language
setLanguage('ar'); // or 'en'
```

## ?? API Integration

The app connects to your .NET 8 API via proxy configuration:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:7295',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

## ?? State Management

Using TanStack Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading & error states

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: () => base44.entities.Project.list(),
});
```

## ?? Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # Lint code
```

## ?? Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

### Quick Fixes

**Dependency Issues:**
```bash
npm install --legacy-peer-deps
```

**Clear Cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

**Build Errors:**
```bash
npm run type-check
npm run build
```

## ?? Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist` directory.

## ?? Configuration

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=https://your-api-url.com/api
```

### Vite Config
See `vite.config.ts` for:
- API proxy settings
- Build configuration
- Path aliases

## ?? Adding New Pages

1. Create a new Vue component in `src/views/`
2. Add route in `src/router/index.ts`
3. Add navigation item in `src/components/Layout.vue`
4. Add translations in `src/composables/translations.ts`

Example:
```typescript
// router/index.ts
{
  path: '/new-page',
  name: 'new-page',
  component: () => import('@/views/NewPage.vue'),
}
```

## ?? Customizing Styles

### Tailwind Config
Edit `tailwind.config.js` for theme customization.

### CSS Variables
Edit `src/assets/globals.css` for color scheme:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}
```

## ?? Tech Stack

- **Vue 3.5** - Progressive JavaScript framework
- **TypeScript 5.9** - Type-safe JavaScript
- **Vite 7** - Next-generation build tool
- **Vue Router 5** - Official router
- **TanStack Query 5** - Data synchronization
- **Tailwind CSS 3** - Utility-first CSS
- **Radix Vue 1.9** - Accessible components
- **Lucide Vue** - Beautiful icons
- **Axios** - HTTP client
- **date-fns** - Date utilities

## ?? Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run type-check`
4. Submit a pull request

## ?? License

This project is part of the Release Manager system.

## ?? Support

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Check [INSTALLATION.md](./INSTALLATION.md)
- Review the API documentation
- Check browser console for errors

---

Built with ?? using Vue 3 + TypeScript

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
