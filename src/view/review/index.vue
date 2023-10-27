<script setup lang='ts'>
import HlTabBer from '@/components/HlTabbar/index.vue';
import { onMounted, reactive, ref } from 'vue';
import { getReviewPageApi, getReviewTypeListApi } from '@/api/review';
import { getAction, postAction } from '@/api/common';
import { AxiosResponse } from 'axios';
import { StatusEnum } from '@/common/status.enum';
import { PageEntity } from '@/common/page.entity';

type ReviewItem = {
  id: string;
  reviewTypeName: string;
  content: string;
  pictureUrl: string;
}

const listEleRef = ref();
const state = reactive({
  chapterName: '',
  reviewType: '',
  cascaderValue: '',
  showCascader: false,
  typeList: [],
  dataList: [] as Array<ReviewItem>,
  pageInfo: {
    ...new PageEntity(),
    pageSize: 3
  },
  showImg: false
});
const getReviewTypeList = () => {
  getAction(getReviewTypeListApi, '').then((res: AxiosResponse) => {
    if (res.status === StatusEnum.SUCCESS) {
      res.data.map((item: any) => {
        if (item.children.length == 0) {
          delete item.children;
        } else {
          item.children.map((ele: any) => {
            if (ele.children.length == 0) {
              delete ele.children;
            }
          })
        }
      })
      state.typeList = res.data;
    }
  })
};
const getReviewList = () => {
  postAction(getReviewPageApi, {
    ...state.pageInfo,
    reviewType: state.reviewType
  }).then((res: AxiosResponse) => {
    if (res.status === StatusEnum.SUCCESS) {
      if (listEleRef) {
        listEleRef.value.scroll({
          top: 0,
          behavior: 'smooth'
        });
      }
      state.dataList = res.data.list;
      state.pageInfo.totalRecords = res.data.total;
    }
  });
}
const onFinish = (data: any) => {
  state.chapterName = data.selectedOptions.map((option: any) => option.name).join('/')
  state.reviewType = data.value;
  getReviewList();
  state.showCascader = false;
};
const changePage = (index: number) => {
  state.pageInfo.pageIndex = index;
  getReviewList();
};
onMounted(() => {
  getReviewTypeList();
  getReviewList();
});
</script>

<template>
  <div class='review-container h100 h-calc'>
    <van-field
      v-model="state.chapterName"
      is-link
      readonly
      label="章节"
      placeholder="请选择章节"
      @click="state.showCascader = true"
    />
    <van-popup v-model:show="state.showCascader" round position="bottom">
      <van-cascader
        v-model="state.cascaderValue"
        title="请选择章节"
        :options="state.typeList"
        @close="state.showCascader = false"
        @finish="onFinish"
        :field-names='{ text: "name", value: "id", children: "children" }'
      />
    </van-popup>
    <div ref='listEleRef' :class='["list", state.dataList.length ? "" : "no-page"]'>
      <div class='list-item' v-if='state.dataList.length'>
        <div class='item' v-for='item in state.dataList' :key='item.id'>
          <div class='title'>{{item.reviewTypeName}}</div>
          <div class='content' v-html='item.content'></div>
        </div>
      </div>
      <NoData v-else />
      <van-back-top right='10' bottom='35%' />
    </div>
    <van-icon class='eye-icon'
              size='25'
              :name="state.showImg ? 'eye-o' : 'closed-eye'"
              @click='state.showImg = !state.showImg' />
    <div class='page-box' v-if='state.dataList.length'>
      <van-pagination
        @change='changePage'
        v-model="state.pageInfo.pageIndex"
        :total-items="state.pageInfo.totalRecords"
        :items-per-page="state.pageInfo.pageSize" />
    </div>
    <HlTabBer />
  </div>
</template>

<style scoped lang='scss'>
.review-container{
  .list{
    height: calc(100% - 208px);
    overflow-y: scroll;
    background: #fff;
    padding: 20px;
    .list-item{
      .item{
        border-bottom: 1px dashed #f40;
        margin: 20px 0;
        &:last-child{
          border-bottom: none;
        }
        .title{
          font-weight: 700;
          text-align: center;
          margin-bottom: 10px;
          background: #ddd;
          padding: 10px;
        }
      }
    }
  }
  .no-page{
    height: calc(100% - 128px);
  }
  .eye-icon{
    position: fixed;
    top: 50%;
    right: 20px;
  }
  .page-box{
    position: fixed;
    bottom: 100px;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    justify-content: center;
  }
}
</style>
