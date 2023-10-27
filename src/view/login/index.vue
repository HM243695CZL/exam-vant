<script setup lang='ts'>
  import { reactive } from 'vue';
  import { loginApi } from '@/api/user';
  import { postAction } from '@/api/common';
  import { AxiosResponse } from 'axios';
  import { StatusEnum } from '@/common/status.enum';
  import { Session } from '@/utils/storage';
  import router from '@/router';

  const state = reactive({
    ruleForm: {
      username: '黄学生',
      password: '123456',
    }
  });
  const clickLogin = () => {
    postAction(loginApi, state.ruleForm).then((res: AxiosResponse) => {
      if (res.status === StatusEnum.SUCCESS) {
        Session.set('token', res.data.token);
        Session.set('userInfo', res.data.userInfo);
        router.push({ path: '/' });
      }
    });
  }
</script>

<template>
  <div class='login-container h100'>
    <div class='title'>登录</div>
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
        <van-button class='login-btn' block round type="primary" native-type="submit">登录</van-button>
      </van-form>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.login-container{
  padding: 20px;
  margin-top: 200px;
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
  }
}
</style>
