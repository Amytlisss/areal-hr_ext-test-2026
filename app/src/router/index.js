import { createRouter, createWebHistory } from 'vue-router';
import OrganizationsPage from '../views/OrganizationsPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/organizations',
  },
  {
    path: '/organizations',
    name: 'Organizations',
    component: OrganizationsPage,
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('../views/DepartmentsPage.vue'),
  },
//   {
//     path: '/positions',
//     name: 'Positions',
//     component: () => import('../views/PositionsPage.vue'),
//   },
//   {
//     path: '/employees',
//     name: 'Employees',
//     component: () => import('../views/EmployeesPage.vue'),
//   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;