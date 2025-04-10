import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; // 直接导入首页组件

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // 临时路由 - 将来会替换为实际组件
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/PlaceholderView.vue')
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('../views/PlaceholderView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/PlaceholderView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/PlaceholderView.vue')
  },
  // 动态路由
  {
    path: '/categories/:slug',
    name: 'category-detail',
    component: () => import('../views/PlaceholderView.vue')
  },
  {
    path: '/tags/:slug',
    name: 'tag-detail',
    component: () => import('../views/PlaceholderView.vue')
  },
  {
    path: '/posts/:id',
    name: 'post-detail',
    component: () => import('../views/PostDetailView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;