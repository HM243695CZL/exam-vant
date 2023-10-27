<script setup lang='ts'>
import HlTabBer from '@/components/HlTabbar/index.vue';
import { Session } from '@/utils/storage';
import { useRouter } from 'vue-router';

const router = useRouter();
const clickLogout = () => {
  Session.clear();
  router.replace('/login');
}
</script>

<template>
  <div class='person-container h100 h-calc'>
    <van-button type="primary" @click='clickLogout'>退出登录</van-button>
    <HlTabBer />
  </div>
</template>

<style scoped lang='scss'>

</style>
