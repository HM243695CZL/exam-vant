<script setup lang='ts'>
import HlTabBer from '@/components/HlTabbar/index.vue';
import { Session } from '@/utils/storage';
import { useRouter } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { getUserInfoApi } from '@/api/user';
import { getAction } from '@/api/common';
import { StatusEnum } from '@/common/status.enum';
import defaultAvatar from '@/assets/default-avatar.jpg';

type UserInfoType = {
  username: string;
  sex: number;
  avatar: string;
}

const router = useRouter();
const state = reactive({
  userInfo: {} as UserInfoType
});
const clickLogout = () => {
  Session.clear();
  router.replace('/login');
};
const getUserInfo = () => {
  const userId = Session.get('userInfo').id;
  getAction(getUserInfoApi + '/' + userId, '').then(res => {
    if (res.status === StatusEnum.SUCCESS) {
      state.userInfo = res.data;
    }
  });
};
onMounted(() => {
  getUserInfo();
})
</script>

<template>
  <div class='person-container h100 h-calc'>
    <div class='row'>
      <div class='avatar-img'>
        <img v-if='state.userInfo.avatar' :src='state.userInfo.avatar' alt=''>
        <img v-else :src='defaultAvatar' alt=''>
      </div>
    </div>
    <div class='row'>
      <div class='key'>
        姓名：{{state.userInfo.username}}
      </div>
    </div>
    <div class='row'>
      <div class='key'>性别：{{state.userInfo.sex === 0 ? '男' : '女'}}</div>
    </div>
    <div class='logout-btn'>
      <van-button type="default" @click='clickLogout'>退出登录</van-button>
    </div>
    <HlTabBer />
  </div>
</template>

<style scoped lang='scss'>
  .person-container{
    .row{
      .avatar-img{
        width: 200px;
        height: 200px;
        margin: 0 auto;
        img{
          display: block;
          width: 100%;
          height: auto;
          border-radius: 50%;
        }
      }
      .key{
        margin: 0 auto;
        width: 60%;
        padding: 10px 0;
      }
    }
    .logout-btn{
      position: fixed;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
