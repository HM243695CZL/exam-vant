<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
import { PageEntity } from '@/common/page.entity';
import { postAction } from '@/api/common';
import { AxiosResponse } from 'axios';
import { getMyExamApi } from '@/api/paper';
import HlTabBer from '@/components/HlTabbar/index.vue';

const state = reactive({
  examList: [],
  pageInfo: new PageEntity()
})
const getMyExamList = () => {
  postAction(getMyExamApi, state.pageInfo).then((res: AxiosResponse) => {
    console.log(res);
  })
};
onMounted(() => {
  getMyExamList();
})
</script>

<template>
  <div class='my-exam-container h100 h-calc'>
    <HlTabBer />
  </div>
</template>

<style scoped lang='scss'>
  .my-exam-container{

  }
</style>
