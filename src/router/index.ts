import { createRouter, createWebHistory } from 'vue-router'
import { applyMiddleware } from '@/middleware'
import auth from '@/middleware/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { middleware: auth },
    component: () => import('@/pages/home/index.vue')
  },
  {
    path: '/invoices',
    name: 'Invoices',
    meta: { middleware: auth },
    component: () => import('@/App.vue')
  },
  {
    path: '/customers',
    name: 'Customers',
    meta: { middleware: auth },
    component: () => import('@/pages/customer/index.vue')
  },
  {
    path: '/customers/create',
    name: 'CreateCustomer',
    meta: { middleware: auth },
    component: () => import('@/pages/customer/create.vue')
  },
  {
    path: '/customers/:id',
    name: 'EditCustomer',
    meta: { middleware: auth },
    component: () => import('@/pages/customer/edit.vue')
  },
  {
    path: '/products',
    name: 'Products',
    meta: { middleware: auth },
    component: () => import('@/pages/product/index.vue')
  },
  {
    path: '/products/create',
    name: 'CreateProduct',
    meta: { middleware: auth },
    component: () => import('@/pages/product/create.vue')
  },
  {
    path: '/products/:id',
    name: 'EditProduct',
    meta: { middleware: auth },
    component: () => import('@/pages/product/edit.vue')
  },
  {
    path: '/stores',
    name: 'Stores',
    meta: { middleware: auth },
    component: () => import('@/pages/store/index.vue')
  },
  {
    path: '/stores/create',
    name: 'CreateStore',
    meta: { middleware: auth },
    component: () => import('@/pages/store/create.vue')
  },
  {
    path: '/stores/:id',
    name: 'EditStore',
    meta: { middleware: auth },
    component: () => import('@/pages/store/edit.vue')
  },

  // No auth required
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/login.vue')
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// apply middleware
router.beforeEach(applyMiddleware)

export default router
