import { createRouter, createWebHistory } from 'vue-router';
import OrganizationsPage from '../views/OrganizationsPage.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/organizations',
    meta: { requiresAuth: true },
  },
  {
    path: '/organizations',
    name: 'Organizations',
    component: OrganizationsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('../views/DepartmentsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/positions',
    name: 'Positions',
    component: () => import('../views/PositionsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../views/EmployeesPage.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  await authStore.checkAuth();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/organizations');
  } else {
    next();
  }
});

export default router;