<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getAction } from '@/api/common';
import { getPaperInfoApi } from '@/api/paper';
import { StatusEnum } from '@/common/status.enum';


type PaperType = {
  name: string;
  score: string;
}
type QuestionItem = {
  id: string;
  name: string;
}

type Question = {
  id: string;
  questionItemList: Array<QuestionItem>;
  currentUserAnswer: string;
  answer: string;
  type: number;
  question: string;
  score: string;
  analysis: string;
  currentUserAnswerIndex: number;
  answerIndex: number;
  userAnswerList: Array<number>;
  correctAnswerList: Array<number>;
}

type QuestionBigItem = {
  id: string;
  name: string;
  bigId: string;
  questionList: Array<Question>;
  bigName: string;
  questionScore: string;
}

type answerRecordType = {
  score: string;
}
const route = useRoute();
const state = reactive({
  paperId: '',
  paperInfo: {
    paper: {} as PaperType,
    questionBigList: [] as Array<QuestionBigItem>,
    answerRecordInfo: {} as answerRecordType,
  },
  itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
});
const getPaperInfo = () => {
  getAction(getPaperInfoApi + '/' + state.paperId, '').then(res => {
    if (res.status === StatusEnum.SUCCESS) {
      const { paper, questionBigList, answerRecordInfo } = res.data;
      state.paperInfo.paper = paper;
      state.paperInfo.answerRecordInfo = answerRecordInfo;
      state.paperInfo.questionBigList = questionBigList;
      state.paperInfo.questionBigList.map(item => {
        item.questionList.map(ele => {
          const userAnswerList = [] as Array<number>
          const correctAnswerList = [] as Array<number>;
          ele.questionItemList.map((e, index) => {
            if (ele.type === 2) {
              if (ele.currentUserAnswer.indexOf(e.id) > -1) {
                userAnswerList.push(index);
              }
              if (ele.answer.indexOf(e.id) > -1) {
                correctAnswerList.push(index);
              }
            } else {
              if (ele.currentUserAnswer === e.id) {
                ele.currentUserAnswerIndex = index;
              }
              if (ele.answer === e.id) {
                ele.answerIndex = index;
              }
            }
          });
          ele.userAnswerList = userAnswerList;
          ele.correctAnswerList = correctAnswerList;
        })
      });
    }
  });
};
// 判断一个数组是否包含另一个数组
const arrContain = (arr1: any, arr2: any) => {
  if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) return false;
  if (arr1.length < arr2.length) return false;
  for (let i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) === -1) return false;
  }
  return true;
};
onMounted(() => {
  state.paperId = route.params.id as string;
  getPaperInfo();
});
</script>

<template>
  <div class='view-paper-container h100'>
    <div class='paper-name'>
      {{state.paperInfo.paper.name}}
    </div>
    <div class='paper-info'>
      试卷总分：<span>{{state.paperInfo.paper.score}}</span>分
      考试得分：<span>{{state.paperInfo.answerRecordInfo.score}}</span>分
    </div>
    <div class='question-content'>
      <div class='big-list' v-for='item in state.paperInfo.questionBigList' :key='item.bigId'>
        <div class='big-question-name'>
          {{item.bigName}}(共{{item.questionList.length}}题，合计{{item.questionScore}}分)
        </div>
        <div class='question-list'>
          <div class='question-list-row' v-for='(ele, index) in item.questionList' :key='ele.id'>
            <div class='question-name'>
              <div class='index-number'>{{index + 1}}. </div>
              <div class='question-name-text' v-html='ele.question'></div>
              <div class='score'>({{ele.score}}分)</div>
            </div>
            <div class='question-item-list'>
              <div class='question-item' v-for='(e, i) in ele.questionItemList' :key='e.id'>
                <span class='option-item'>{{state.itemIndex[i]}}.</span><span v-html='e.name'></span>
              </div>
            </div>
            <div class='view-answer'>
              <div class='your-answer'>
                你的答案：
                <span v-if='ele.type === 2'>
									{{ele.userAnswerList.map(e => state.itemIndex[e]).join(',')}}
								</span>
                <span v-else>{{state.itemIndex[ele.currentUserAnswerIndex]}}</span>
                <div class='result'>
                  <div class='yes' v-if='ele.answer === ele.currentUserAnswer'>
                    <div class='half-yes'>
                      <van-icon name="success" size='50' color='#f40' />
                    </div>
                  </div>
                  <div class='half-yes' v-else-if='ele.type === 2 && arrContain(ele.answer.split(","), ele.currentUserAnswer.split(","))'>
                    <van-icon name="success" size='50' color='#f40' />
                    <div class='bias-line'></div>
                  </div>
                  <div class='no' v-else>
                    <van-icon name="cross" size='50' color='#f40' />
                  </div>
                </div>
              </div>
              <div class='correct-answer'>
                正确答案：
                <span v-if='ele.type === 2'>
									{{ele.correctAnswerList.map(e => state.itemIndex[e]).join(',')}}
								</span>
                <span v-else>{{state.itemIndex[ele.answerIndex]}}</span>
              </div>
              <div class='analysis'>
                解析：
                <div class='analysis-html' v-html='ele.analysis'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
  .view-paper-container{
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
    .paper-info{
      text-align: center;
      font-size: 30px;
      width: calc(100% - 40px);
      span{
        color: #f40;
      }
    }
    .question-content{
      flex: 1;
      overflow-y: scroll;
      .big-list{
        .big-question-name{
          padding: 15px;
          background: #fff;
        }
        .question-list{
          background: #fff;
          padding: 20px;
          .question-list-row{
            .question-name{
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              position: relative;
              .view-origin{
                position: absolute;
                top: 30px;
                right: 10px;
              }
              .index-number{
                width: 20px;
                margin-top: 8px;
                margin-right: 20px;
              }
              .question-name-text{
                flex: 1;
                line-height: 1.5;
                ::v-deep(p){
                  display: inline-block;
                  color: #000;
                }
              }
              .score{
                color: #dd4a68;
              }
            }
            .question-item-list{
              margin-left: 40px;
              .question-item{
                padding: 10px 0;
                display: flex;
                align-items: flex-start;
                .option-item{
                  margin-right: 3px;
                }
                ::v-deep {
                  img{
                    width: 100px;
                    height: 100px;
                  }
                  p{
                    display: inline-block;
                  }
                }
              }
            }
            .your-answer{
              padding: 10px 0;
              margin-left: 20px;
              display: flex;
              align-items: center;
              position: relative;
              span{
                color: #f40;
              }
              .result{
                position: absolute;
                top: 0;
                right: 20px;
                .half-yes{
                  .bias-line{
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 60px;
                    height: 60px;
                    &:after{
                      content: '';
                      position: absolute;
                      top: 30px;
                      left: 20px;
                      width: 100%;
                      height: 8px;
                      background: #f40;
                      transform: rotate(45deg);
                    }
                  }
                }
              }
            }
            .correct-answer{
              padding: 10px 0;
              margin-left: 20px;
              span{
                color: #126ac6;
              }
            }
            .analysis{
              padding: 10px 0;
              margin-left: 20px;
              color: #f40;
              line-height: 1.5;
              .analysis-html{
                margin-left: 10px;
                margin-top: 10px;
                :deep(img) {
                  display: block;
                  width: 100%;
                  height: auto;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
