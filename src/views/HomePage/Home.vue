<template>
  <div class="home">
    <!-- 头部 -->
    <van-nav-bar>
      <template #left>
        <div class="home-nav">
          <div class="title">中午好</div>
          <div class="title_sub">ALi</div>
        </div>
      </template>
      <template #right>
        <div class="home-search">
          <van-search placeholder="请输入搜索关键词" />
        </div>
      </template>
    </van-nav-bar>
    <!-- 内容 -->
    <div class="home-content">
      <!-- 轮播图-广告 -->
      <div class="banner_box">
        <van-swipe
          :height="220"
          class="my-swipe"
          :autoplay="3000"
          loop
          indicator-color="white"
        >
          <van-swipe-item v-for="(item, index) in bann_data" :key="index">
            <span class="banner_title">{{ item.name }}</span>
            <img
              class="auto_img"
              :src="item.bannerImg"
              :alt="item.name"
              @click="GotoDetial(item.pid)"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product_box">
        <div class="popular_title_box">
          <span class="popular_title">热门推荐</span>
        </div>
        <lazy-component>
          <div class="products">
            <div
              class="products_item"
              v-for="(item, index) in hotpro_data"
              :key="index"
              @click="GotoDetial(item.pid)"
            >
              <div class="pro_hot" v-if="item.isHot">Hot</div>
              <div>
                <img
                  class="auto_img"
                  :src="item.smallImg"
                  alt="item.name"
                  :v-lazy="item.smallImg"
                />
              </div>
              <div class="pro_info">
                <div class="pro_name Text_abb">
                  {{ item.name }}
                </div>
                <div class="pro_desc Text_abb">
                  {{ item.desc }}
                </div>
                <div class="pro_price">￥{{ item.price }}</div>
              </div>
            </div>
          </div>
        </lazy-component>
      </div>
    </div>
  </div>
</template>
<script>
import "../../assets/less/home.less";

import { verification } from "../../assets/js/verification";
export default {
  name: "Home",
  data() {
    return {
      bann_data: [],
      hotpro_data: [],
    };
  },
  created() {
    this.getbannImg();
    this.gethotpro();
  },
  methods: {
    getbannImg() {
      this.axios({
        method: "GET",
        url: "/banner",
        params: { appkey: this.appkey },
      })
        .then((res) => {
          // console.log(res);
          if (res.data.code == 300) {
            this.bann_data = res.data.result;
          } else {
          }
          // console.log(res);
        })
        .catch((res) => {
          // this.$toast.clear();
          // console.log(res);
        });
    },
    gethotpro() {
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: { appkey: this.appkey, key: "isHot", value: 1 },
      })
        .then((res) => {
          // console.log(res);
          if (res.data.code == 500) {
            this.hotpro_data = res.data.result;
          } else {
          }
          // console.log(res);
        })
        .catch((res) => {
          // this.$toast.clear();
          // console.log(res);
        });
    },
    GotoDetial(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
  },
};
</script>
