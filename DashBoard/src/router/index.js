import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Verify from '@/views/Verify'
import BlockchainPO from '@/views/BlockchainPO'

Vue.use(VueRouter)

const routes = [
  {
    meta: {
      title: 'Login'
    },
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    meta: {
      title: 'Verify'
    },
    path: '/verify',
    name: 'Verify',
    component: Verify
  },
  {
    meta: {
      title: 'Blockchain PO'
    },
    path: '/blockchainPO',
    name: 'Blockchain PO',
    component: BlockchainPO
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') === null) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

export function useRouter () {
  return router
}
