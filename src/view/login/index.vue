<script setup lang='ts'>
  import { reactive } from 'vue';
  import { loginApi, registerApi } from '@/api/user';
  import { postAction } from '@/api/common';
  import { AxiosResponse } from 'axios';
  import { StatusEnum } from '@/common/status.enum';
  import { Session } from '@/utils/storage';
  import router from '@/router';

  const state = reactive({
    ruleForm: {
      username: '',
      password: '',
    },
    isLogin: true
  });
  const clickLogin = () => {
    if (state.isLogin) {
      postAction(loginApi, state.ruleForm).then((res: AxiosResponse) => {
        if (res.status === StatusEnum.SUCCESS) {
          Session.set('token', res.data.token);
          Session.set('userInfo', res.data.userInfo);
          router.push({ path: '/' });
        }
      });
    } else {
      postAction(registerApi, state.ruleForm).then((res: AxiosResponse) => {
        if (res.status === StatusEnum.SUCCESS) {
          Session.set('token', res.data.token);
          router.push({ path: '/' });
        }
      });
    }
  }
</script>

<template>
  <div class='login-container h100'>
    <div class='title'> {{state.isLogin ? '登录' : '注册'}}</div>
    <div class='form-box'>
      <van-form @submit='clickLogin'>
        <van-cell-group inset>
          <van-field
            v-model="state.ruleForm.username"
            required
            label="用户名"
            placeholder="请输入用户名"
            :rules='[{ required: true, message: "请输入用户名" }]'
          />
          <van-field
            v-model="state.ruleForm.password"
            required
            type='password'
            label="密码"
            placeholder="请输入密码"
            :rules='[{ required: true, message: "请输入密码" }]'
          />
        </van-cell-group>
        <van-button class='login-btn' block round type="primary" native-type="submit">{{state.isLogin ? '登录' : '注册并登录'}}</van-button>
        <div class='register-box'>
          <van-button size="small" @click='state.isLogin = !state.isLogin'>{{state.isLogin ? '注册新账号' : '去登录'}}</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.login-container{
  padding: 20px;
  height: calc(100vh - 40px);
  .title{
    font-size: 50px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  .form-box{
    padding: 20px;
    background: #fff;
    .login-btn{
      margin-top: 20px;
    }
    .register-box{
      margin-top: 15px;
    }
  }
}
</style>
