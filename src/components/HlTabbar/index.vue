<script setup lang='ts'>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const state = reactive({
  active: route.path,
  tabList: [
    {
      icon: 'home-o',
      text: '我的考试',
      path: '/my-exam'
    },
    {
      icon: 'search',
      text: '错题本',
      path: '/wrong-book'
    },
    {
      icon: 'friends-o',
      text: '复习资料',
      path: '/review'
    },
    {
      icon: 'setting-o',
      text: '个人中心',
      path: '/person'
    }
  ]
});
</script>

<template>
  <van-tabbar v-model="state.active">
    <van-tabbar-item v-for='item in state.tabList'
                     :name='item.path'
                     :key='item.path'
                     :to='item.path'
                     :icon="item.icon">
      {{item.text}}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped lang='scss'>

</style>
