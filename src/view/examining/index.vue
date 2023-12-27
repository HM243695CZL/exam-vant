<script setup lang='ts'>

import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPaperPreviewApi } from '@/api/paper';
import { getAction } from '@/api/common';
import { StatusEnum } from '@/common/status.enum';

type BigInfoType = {
  bigName: string;
  questionList: Array<any>;
  questionScore: string;
  score: string;
}

type QuestionInfoType = {
  id: string;
  score: string;
  question: string;
  questionItemList: Array<any>;
  type: number;
}


const route = useRoute();
const state = reactive({
  id: '',
  paperInfo: {
    paper: {},
    questionBigList: []
  },
  itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  currentBigInfo: {} as BigInfoType,
  currentQuestionInfo: {} as QuestionInfoType,
  currentBigIndex: 0,
  currentQuestionIndex: 0,
  answerMap: {} as any,
  chooseAnswer: ''
});
const getPaperInfo = () => {
  getAction(getPaperPreviewApi + '/' + state.id, '').then(res => {
    if (res.status === StatusEnum.SUCCESS) {
      const { paper, questionBigList } = res.data;
      state.paperInfo.paper = paper;
      state.paperInfo.questionBigList = questionBigList;
      if (questionBigList.length) {
        state.currentBigInfo = questionBigList[0];
        state.currentQuestionInfo = questionBigList[0].questionList[0];
      }
    }
  })
};
const changeCheckAnswer = () => {
  const answerArr = [] as Array<string>;
  state.currentQuestionInfo.questionItemList.map(item => {
    if (item.check) {
      answerArr.push(item.id)
    }
  })
  state.answerMap[state.currentQuestionInfo.id] = answerArr.join(',');
};
const changeAnswer = (itemId: string) => {
  state.answerMap[state.currentQuestionInfo.id] = itemId;
};
onMounted(() => {
  state.id = route.params.id as string;
  getPaperInfo();
})
</script>

<template>
  <div class='examining-container h100'>
    <div class='paper-name'>
      {{state.paperInfo.paper.name}}
    </div>
    <div class='process-bar'>
      <van-progress :percentage="50" color='#ee0a24' />
    </div>
    <div class='question-area'>
      <div class='question-info'>
        <div class='head'>
          {{state.currentBigInfo.bigName}}
          (共{{state.currentBigInfo.questionList?.length}}题，合计{{state.currentBigInfo.questionScore}}分)
          <span class='curr-q-score'>({{state.currentQuestionInfo.score}}分)</span>
        </div>
        <div class='question-list'>
          <div class='question-title'>
            <div class='index-number'>{{state.currentQuestionIndex + 1}}. </div>
            <div class='question-name' v-html='state.currentQuestionInfo.question'></div>
          </div>
          <div class='list-item-box'>
            <div class='box' v-if='state.currentQuestionInfo.type === 2'>
              <div class='list-item' v-for='(item, index) in state.currentQuestionInfo.questionItemList' :key='item.id'>
                <van-checkbox shape='square' @change='changeCheckAnswer' v-model="item.check">
                  {{state.itemIndex[index]}}<span :class='["item", state.currentQuestionInfo.type === 2 ? "check-item" : ""]' v-html='item.name'></span>
                </van-checkbox>
              </div>
            </div>
            <van-radio-group v-else v-model="state.chooseAnswer" @change='changeAnswer' shape='dot'>
              <van-radio v-for='(item, index) in state.currentQuestionInfo.questionItemList' :key='item.id' :name="item.id">
                {{state.itemIndex[index] + '. '}}<span :class='["item", state.currentQuestionInfo.type === 2 ? "check-item" : ""]' v-html='item.name'></span>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
  .examining-container{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    .paper-name{
      text-align: center;
      font-weight: 700;
      font-size: 40px;
      padding: 10px 20px;
      background: #fff;
      width: calc(100% - 40px);
      border-bottom: 1px solid #ccc;
    }
    .process-bar{
      width: 100%;
    }
    .question-area{
      background: #fff;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .head{
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #f1f1f1;
        padding: 0 20px;
        box-sizing: border-box;
        .curr-q-score{
          color: #f40;
          font-size: 30px;
        }
      }
      .question-list{
        padding: 0 20px;
        .question-title{
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 20px;
          padding: 10px 0;
          .index-number{
            margin-right: 8px;
            margin-top: 4px;
          }
          .question-name{
            line-height: 1.5;
            ::v-deep p{
              display: inline-block;
              color: #000;
            }
          }
        }
        .list-item-box{
          .van-checkbox, .van-radio{
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
