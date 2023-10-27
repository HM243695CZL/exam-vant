import { createRouter, createWebHashHistory } from 'vue-router'
import { Session } from '@/utils/storage';

const routes = [
  {
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'my-exam'
    }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/view/login/index.vue'),
    meta: {
      title: '登录'
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
  const token = Session.get('token');
  if (to.path === '/login' && !token) {
    next();
  } else {
    if (!token) {
      next(`/login`);
      Session.clear();
    } else if (token && to.path === '/login') {
      next('/my-exam');
    } else {
      next();
    }
  }
})

export default router
