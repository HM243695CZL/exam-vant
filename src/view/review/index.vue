<script setup lang='ts'>
import HlTabBer from '@/components/HlTabbar/index.vue';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useRect } from '@vant/use';
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
const listItemEleRef = ref();
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
  showImgDialog: false,
  viewImgList: [] as Array<string>,
  directoryList: [] as any,
  showDirectory: false,
  topDataList: [] as Array<number>
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
      state.directoryList = [];
      res.data.list.map((item: ReviewItem) => {
        // 获取h2标签,并且添加到目录中
        const h2Name = item.content.match(/<h2.*?>(.*?)<\/h2>/);
        if (h2Name) {
          state.directoryList.push(h2Name[1]);
        }
      });
      state.dataList = res.data.list;
      state.pageInfo.totalRecords = res.data.total;
      nextTick(() => {
        state.topDataList = [];
        if (listItemEleRef.value) {
          listItemEleRef.value.map((item: any) => {
            const rect = useRect(item);
            state.topDataList.push(rect.top);
          })
        }
      })
    }
  });
}
const onFinish = (data: any) => {
  state.chapterName = data.selectedOptions.map((option: any) => option.name).join('/')
  state.reviewType = data.value;
  state.pageInfo.pageIndex = 1;
  getReviewList();
  state.showCascader = false;
};
const changePage = (index: number) => {
  state.pageInfo.pageIndex = index;
  getReviewList();
};
const showOriginImg = (data: ReviewItem) => {
  state.viewImgList = data.pictureUrl.split(',');
  state.showImgDialog = true;
};
const clickDirectory = (data: string, index: number) => {
  listEleRef.value.scroll({
    top: state.topDataList[index],
    behavior: 'smooth'
  });
}
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
        <div class='item' v-for='item in state.dataList' :key='item.id' ref='listItemEleRef'>
          <div class='title'>{{item.reviewTypeName}}</div>
          <div class='content' v-html='item.content'></div>
          <div class='img-box'>
            <div class='show-origin-img' @click='showOriginImg(item)'>查看原图</div>
          </div>
        </div>
        <div :class='["directory-list", state.showDirectory ? "show-directory" : ""]'>
          <div class='direct-item' v-for='(item, index) in state.directoryList' :key='item' @click='clickDirectory(item, index)'>
            {{item.slice(0, 4)}}
          </div>
        </div>
      </div>
      <NoData v-else />
      <van-back-top right='10' bottom='35%' />
    </div>
    <van-icon class='eye-icon'
              size='25'
              :name="state.showDirectory ? 'eye-o' : 'closed-eye'"
              @click='state.showDirectory = !state.showDirectory' />
    <van-dialog width='100%' v-model:show="state.showImgDialog" title="查看图片"
                confirmButtonText="关闭"
                :closeOnClickOverlay='true'>
      <div class='view-img-box'>
        <van-image v-for='item in state.viewImgList' :key='item' :src='item' />
      </div>
    </van-dialog>
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
        .img-box{
          .show-origin-img{
            color: #f40;
            margin-bottom: 20px;
          }
          .van-image{
            margin-bottom: 10px;
            border: 1px solid #ccc;
          }
        }
      }
    }
    .directory-list{
      position: fixed;
      left: -20%;
      top: 20%;
      background: #fff;
      box-shadow: 0 0 10px #ccc;
      &.show-directory{
        left: 0;
        animation: showDirectory 1s;
      }
      @keyframes showDirectory {
        0%{
          left: -20%;
        }
        100%{
          left: 0;
        }
      }
      .direct-item{
        padding: 10px;
        &.active{
          color: #126ac6;
        }
      }
    }
  }
  .view-img-box{
    height: 60vh;
    overflow: scroll;
  }
  .eye-icon{
    position: fixed;
    top: 30%;
    right: 20px;
  }
  .no-page{
    height: calc(100% - 128px);
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
