import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'my-exam'
    }
  },
  {
    name: 'my-exam',
    path: '/my-exam',
    component: () => import('@/view/my-exam/index.vue'),
    meta: {
      title: '我的考试'
    }
  }

]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

router.beforeEach((to, from, next) => {
  const title = to?.meta?.title
  if (title) {
    document.title = title as string
  }
  next()
})

export default router
