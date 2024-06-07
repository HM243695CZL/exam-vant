<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
import { PageEntity } from '@/common/page.entity';
import { postAction } from '@/api/common';
import { AxiosResponse } from 'axios';
import { getMyExamApi } from '@/api/paper';
import HlTabBer from '@/components/HlTabbar/index.vue';
import { StatusEnum } from '@/common/status.enum';
import { useRouter } from 'vue-router';

type Paper = {
  id: string;
  name: string;
  questionInfo: string;
  questionCount: string;
  score: string;
  examScore: string;
}
const router = useRouter();
const state = reactive({
  examList: [] as Array<Paper>,
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
const changePage = (pageIndex: number) => {
  state.pageInfo.pageIndex = pageIndex;
  getMyExamList();
};
const clickViewPaper = (item: Paper) => {
  router.push('/view-paper/' + item.id);
};
const clickExamining = (item: Paper) => {
  router.push('/examining/' + item.id);
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
        </div>
        <div class='paper-info'>{{item.questionInfo}}</div>
        <div class='count'>
          <span>题数：{{item.questionCount}}</span>
          <div class='exam-score' v-if='item.examScore'>
            {{item.examScore}}
            <span class='unit'>分</span>
          </div>
        </div>
        <div class='score'>
          <span>总分：{{item.score}}</span>
          <van-button v-if='item.examScore !== null' size='small' @click='clickViewPaper(item)'>查看试卷</van-button>
          <van-button v-else type='primary' size='small' @click='clickExamining(item)'>开始考试</van-button>
        </div>
      </div>
      <van-pagination
        v-model="state.pageInfo.pageIndex"
        :total-items="state.pageInfo.totalRecords"
        :show-page-size="3"
        @change='changePage'
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
        margin-bottom: 10px;
        .title{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 40px;
          .name{
            font-weight: bold;
          }
        }
        .paper-info{
          margin-bottom: 15px;
        }
        .count{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          .exam-score{
            color: #f40;
            font-size: 50px;
            .unit{
              font-size: 30px;
            }
          }
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
