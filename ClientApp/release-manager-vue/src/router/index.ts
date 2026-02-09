import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Releases from '@/views/Releases.vue'
import Projects from '@/views/Projects.vue'
import Teams from '@/views/Teams.vue'
import ReleaseItems from '@/views/ReleaseItems.vue'
import ApiTest from '@/views/ApiTest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/releases',
      name: 'releases',
      component: Releases,
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
    },
    {
      path: '/teams',
      name: 'teams',
      component: Teams,
    },
    {
      path: '/release-items',
      name: 'release-items',
      component: ReleaseItems,
    },
    {
      path: '/api-test',
      name: 'api-test',
      component: ApiTest,
    },
  ],
})

export default router
