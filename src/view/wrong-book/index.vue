<script setup lang='ts'>
import HlTabBer from '@/components/HlTabbar/index.vue';
import { onMounted, reactive } from 'vue';
import { PageEntity } from '@/common/page.entity';
import { postAction } from '@/api/common';
import { AxiosResponse } from 'axios';
import { getWrongBookPageApi } from '@/api/wrongBook';
import { StatusEnum } from '@/common/status.enum';

type QuestionItem = {
  id: string;
  name: string;
}

type WrongBook = {
  id: string;
  questionName: string;
  questionItemList: Array<QuestionItem>;
  correctAnswerId: string;
  correctIndex: Array<number>;
  wrongCount: number;
  analysis: string;
}
const state = reactive({
  wrongBookList: [] as Array<WrongBook>,
  pageInfo: new PageEntity(),
  itemIndexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
});
const getWrongBookList = () => {
  postAction(getWrongBookPageApi, state.pageInfo).then((res: AxiosResponse) => {
    if (res.status === StatusEnum.SUCCESS) {
      state.wrongBookList = res.data.list;
      state.pageInfo.totalRecords = res.data.total;
      state.wrongBookList.map(item => {
        const correctAnswer = item.correctAnswerId.split(',');
        const correctIndex: Array<number> = [];
        item.questionItemList.map((ele, index) => {
          if (correctAnswer.includes(ele.id)) {
            correctIndex.push(index);
          }
        });
        item.correctIndex = correctIndex;
      })
    }
  })
};
const changePage = (pageIndex: number) => {
  state.pageInfo.pageIndex = pageIndex;
  getWrongBookList();
};
onMounted(() => {
  getWrongBookList();
});
</script>

<template>
  <div class='wrong-book-container h100 h-calc'>
    <div class='list' v-if='state.wrongBookList.length'>
      <div class='item' v-for='item in state.wrongBookList' :key='item.id'>
        <div class='wrong-count'>{{item.wrongCount}}</div>
        <div class='q-name' v-html='item.questionName'></div>
        <div class='q-item'>
          <div :class='["q-item-ele", item.correctIndex.includes(index) ? "correct-item" : ""]'
               v-for='(ele, index) in item.questionItemList'
               v-html='state.itemIndexList[index] + ". " + ele.name'
               :key='ele.id'></div>
        </div>
        <div class='q-analysis' v-html='item.analysis'></div>
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
  .wrong-book-container{
    .list{
      .item{
        background: #fff;
        padding: 20px;
        line-height: 1.8;
        position: relative;
        border-bottom: 1px dashed #ccc;
        .q-name{
          text-indent: 1em;
        }
        .q-item{
          margin-left: 40px;
          ::v-deep(.q-item-ele){
            p{
              display: inline;
            }
          }
          .correct-item{
            color: #f00;
          }
        }
        .wrong-count{
          position: absolute;
          top: 20px;
          right: 10px;
          color: #fff;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background: rgba(63, 19, 19, 0.3);
        }
        .q-analysis{
          text-indent: 1em;
          color: #d21e71;
        }
      }
    }
  }
</style>
