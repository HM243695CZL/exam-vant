import axios, {AxiosInstance} from 'axios';
import { showLoadingToast, closeToast, showFailToast } from 'vant';
import {Session } from '@/utils/storage';

let loadingReqCount = 0;

const showLoading = () => {
  if (loadingReqCount === 0) {
    showLoadingToast({
      forbidClick: true,
      duration: 0
    });
  }
  loadingReqCount += 1;
}

const hideLoading = () => {
  if (loadingReqCount <= 0) return;
  loadingReqCount -= 1;
  if (loadingReqCount === 0) {
    closeToast();
  }
}

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    showLoading();
    // 在发送请求之前做些什么 token
    if (Session.get('token')) {
      config.headers!['Authorization'] = `${Session.get('token')}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    hideLoading();
    // 对响应数据做点什么
    const res = response.data;
    if (res.status && res.status !== 200) {
      // `token` 过期或者账号已在别处登录
      showFailToast(res.message);
      return Promise.reject(service.interceptors.response);
    } else {
      return response.data;
    }
  },
  (error) => {
    hideLoading();
    // 对响应错误做点什么
    if (error.message.indexOf('timeout') != -1) {
      showFailToast('网络超时');
    } else if (error.message == 'Network Error') {
      showFailToast('网络连接错误')
    } else {
      if (error.response.data) showFailToast('【' + error.response.data.path + '】' + error.response.data.error);
      else showFailToast('接口路径找不到')
    }
    return Promise.reject(error);
  }
);

export default service;
