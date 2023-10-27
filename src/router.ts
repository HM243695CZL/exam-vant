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
  },
  {
    name: 'wrong-book',
    path: '/wrong-book',
    component: () => import('@/view/wrong-book/index.vue'),
    meta: {
      title: '错题本'
    }
  },
  {
    name: 'review',
    path: '/review',
    component: () => import('@/view/review/index.vue'),
    meta: {
      title: '复习资料'
    }
  },
  {
    name: 'person',
    path: '/person',
    component: () => import('@/view/person/index.vue'),
    meta: {
      title: '个人中心'
    }
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})
const whiteList = ['/review'];
router.beforeEach((to, from, next) => {
  const title = to?.meta?.title
  if (title) {
    document.title = title as string
  }
  if (whiteList.includes(to.path)) {
    next();
    return;
  }
  const token = Session.get('token');
  if (to.path === '/login' && !token) {
    next();
  } else {
    if (!token) {
      next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
      Session.clear();
    } else if (token && to.path === '/login') {
      next('/my-exam');
    } else {
      next();
    }
  }
})

export default router
