<template>
  <div class="home">
    <!-- 头部 -->
    <van-nav-bar>
      <template #left>
        <div class="home-nav">
          <div class="title">{{ Greetings }}</div>
          <div class="title_sub">{{ user_info.nickName }}</div>
        </div>
      </template>
      <template #right>
        <div class="home-search">
          <van-search
            shape="round"
            placeholder="请输入搜索关键词"
            @focus="searchF"
          />
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
import "../../assets/less/home.less"

import { verification } from "../../assets/js/verification"
export default {
  name: "Home",
  data () {
    return {
      bann_data: [],
      hotpro_data: [],
      user_info: {},
      Greetings: ""
    }
  },
  created () {
    this.getbannImg()
    this.gethotpro()
    this.get_user_info()
    this.getDate()
  },
  methods: {
    getDate () {
      let hour = new Date().getHours()//获取时间
      if (hour < 6) { this.Greetings = "凌晨好" }
      else if (hour < 9) { this.Greetings = "早上好" }
      else if (hour < 12) { this.Greetings = "上午好" }
      else if (hour < 14) { this.Greetings = "中午好" }
      else if (hour < 17) { this.Greetings = "下午好" }
      else if (hour < 19) { this.Greetings = "傍晚好" }
      else if (hour < 22) { this.Greetings = "晚上好" }
      else { this.Greetings = "夜里好" }
    },
    searchF () {
      this.$router.push({ name: "Search" })
    },
    getbannImg () {
      this.axios({
        method: "GET",
        url: "/banner",
        params: { appkey: this.appkey },
      })
        .then((res) => {
          //
          if (res.data.code == 300) {
            this.bann_data = res.data.result
          } else {
          }
          //
        })
        .catch((res) => {
          // this.$toast.clear();
          //
        })
    },
    gethotpro () {
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: { appkey: this.appkey, key: "isHot", value: 1 },
      })
        .then((res) => {
          //
          if (res.data.code == 500) {
            this.hotpro_data = res.data.result
          } else {
          }
          //
        })
        .catch((res) => {
          // this.$toast.clear();
          //
        })
    },
    GotoDetial (pid) {
      this.$router.push({ name: "Detail", params: { pid } })
    },
    get_user_info () {
      let tokenString = localStorage.getItem("Kf_tk")
      // if (!tokenString) {
      // return this.$router.push({ name: "Login" })
      // }
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == "A001") {
          this.user_info = res.data.result[0]

        }
      })
    }
  },
};
</script>
