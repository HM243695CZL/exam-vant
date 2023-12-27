<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
import { PageEntity } from '@/common/page.entity';
import { postAction } from '@/api/common';
import { AxiosResponse } from 'axios';
import { getMyExamApi } from '@/api/paper';
import HlTabBer from '@/components/HlTabbar/index.vue';
import { StatusEnum } from '@/common/status.enum';

type Question = {
  id: string;
  name: string;
  questionInfo: string;
  questionCount: string;
  score: string;
  examScore: string;
}
const state = reactive({
  examList: [] as Array<Question>,
  pageInfo: new PageEntity()
})
const getMyExamList = () => {
  postAction(getMyExamApi, state.pageInfo).then((res: AxiosResponse) => {
    if (res.status === StatusEnum.SUCCESS) {
      state.examList = res.data.list;
      state.pageInfo.totalRecords = res.data.total;
    }
  })
};
onMounted(() => {
  getMyExamList();
})
</script>

<template>
  <div class='my-exam-container h100 h-calc'>
    <div class='list' v-if='state.examList.length'>
      <div class='item' v-for='item in state.examList' :key='item.id'>
        <div class='title'>
          <div class='name'>{{item.name}}</div>
          <div class='q-info'>{{item.questionInfo}}</div>
        </div>
        <div class='count'>
          题数：{{item.questionCount}}
        </div>
        <div class='score'>
          <span>总分：{{item.score}}</span>
          <van-button v-if='item.examScore' size='mini'>查看试卷</van-button>
          <van-button v-else type='primary' size='mini'>开始考试</van-button>
        </div>
      </div>
      <van-pagination
        v-model="state.pageInfo.pageIndex"
        :total-items="state.pageInfo.totalRecords"
        :show-page-size="3"
        force-ellipses
      />
    </div>
    <NoData v-else />
    <HlTabBer />
  </div>
</template>

<style scoped lang='scss'>
  .my-exam-container{
    .list{
      .item{
        background: #fff;
        padding: 20px;
        .title{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          .name{
            font-weight: bold;
          }
          .q-info{
            color: #f40;
          }
        }
        .count{
          margin-bottom: 10px;
        }
        .score{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>
