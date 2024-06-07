<script setup lang='ts'>

import { computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPaperPreviewApi, submitPaperApi } from '@/api/paper';
import { getAction, postAction } from '@/api/common';
import { StatusEnum } from '@/common/status.enum';
import { showToast } from 'vant';

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
  questionList: Array<any>;
  type: number;
}

type PaperType = {
  name: string;
  questionCount: string;
}


const route = useRoute();
const router = useRouter();
const state = reactive({
  id: '',
  paperInfo: {
    paper: {} as PaperType,
    questionBigList: [] as Array<QuestionInfoType>,
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
const changeQuestion = (type: string) => {
  if (type === 'prev') {
    if (state.currentQuestionIndex === 0) {
      if (state.currentBigIndex === 0) {
        showToast('没有上一题了');
        return false;
      }
      // 切换到上一个大题
      state.currentBigInfo = state.paperInfo.questionBigList[state.currentBigIndex - 1] as any;
      state.currentQuestionInfo = state.currentBigInfo.questionList[state.currentBigInfo.questionList.length - 1];
      state.currentBigIndex -= 1;
      state.currentQuestionIndex = state.currentBigInfo.questionList.length - 1;
    } else {
      state.currentQuestionInfo = state.paperInfo.questionBigList[state.currentBigIndex].questionList[state.currentQuestionIndex - 1];
      state.currentQuestionIndex -= 1;
    }
  } else {
    if (state.paperInfo.questionBigList[state.currentBigIndex].questionList.length - 1 <= state.currentQuestionIndex) {
      if (state.currentBigIndex + 1 >= state.paperInfo.questionBigList.length) {
        showToast('没有下一题了');
        return false;
      } else {
        // 切换到下一个大题
        state.currentBigInfo = state.paperInfo.questionBigList[state.currentBigIndex + 1] as any;
        state.currentQuestionInfo = state.currentBigInfo.questionList[0];
        state.currentBigIndex += 1;
        state.currentQuestionIndex = 0;
      }
    } else {
      state.currentQuestionInfo = state.paperInfo.questionBigList[state.currentBigIndex].questionList[state.currentQuestionIndex + 1];
      state.currentQuestionIndex += 1;
    }
  }
  state.chooseAnswer = '';
  if (state.answerMap[state.currentQuestionInfo.id]) {
    state.chooseAnswer = state.answerMap[state.currentQuestionInfo.id]
  }
};
const clickSubmitPaper = () => {
  postAction(submitPaperApi, {
    paperId: state.id,
    answerMap: state.answerMap
  }).then((res: any) => {
    if (res.status === StatusEnum.SUCCESS) {
      showToast(res.message);
      router.push('/my-exam');
    }
  })
};
const calcAnswerLen = computed(() => {
  return Object.values(state.answerMap).filter(item => !!item).length;
})
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
      <van-progress :percentage="Math.ceil((calcAnswerLen / ~~state.paperInfo.paper.questionCount) * 100) || 0" color='#ee0a24' />
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
      <div class='btn-box'>
        <van-button type='default' round @click='changeQuestion("prev")'>上一题</van-button>
        <van-button type='default' round @click='changeQuestion("next")'>下一题</van-button>
        <van-button type='primary' round @click='clickSubmitPaper'>交卷</van-button>
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
            align-items: flex-start;
          }
        }
      }
      .btn-box{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding-bottom: 20px;
        padding-left: 20px;
        background: #fff;
        button{
          margin-right: 20px;
        }
      }
    }
  }
</style>
