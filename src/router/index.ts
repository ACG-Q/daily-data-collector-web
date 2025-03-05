import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/runner-images',
      name: 'runner-images',
      component: () => import('../views/GithubRunnerImages.vue'),
    },
    {
      path: '/action-versions',
      name: 'action-versions',
      component: () => import('../views/GithubActionVersions.vue'),
    },
    {
      path: '/calender',
      name: 'calender',
      component: () => import('../views/CalendarView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    }
  ],
})

export default router
