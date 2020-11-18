<template>
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      right-text="分享"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="showShare = true"
    >
      <template #right>
        <van-icon name="share-o" size="18" />
      </template>
    </van-nav-bar>
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />

    <div class="info_box">
      <div class="header-image">
        <img class="auto_img" :src="productDetail.large_img" alt="" />
      </div>
      <div class="Pro_content">
        <div class="pro_info">
          <div class="prop_box fl">
            <!-- 头部 -->
            <div class="box_l">
              <div class="pro_name">{{ productDetail.name }}</div>
              <div class="pro_enname">{{ productDetail.enname }}</div>
            </div>
            <div class="box_r">￥{{ productDetail.price }}</div>
          </div>

          <div class="pro_rule">
            <!-- 样式选择 -->
            <div
              class="rule_item fl"
              v-for="(item, index) in productDetail.rules"
              :key="index"
            >
              <div class="rule_title">{{ item.title }}</div>
              <div class="rule_title_item fl">
                <div
                  class="t_item"
                  :class="{
                    active: item.ruleIndex == i,
                    'large-text': v.title.length >= 4,
                  }"
                  v-for="(v, i) in item.rule"
                  :key="i"
                  @click="toggleRule(item, i)"
                >
                  {{ v.title }}
                </div>
              </div>
            </div>
          </div>

          <div class="Quantity fl">
            <div class="select_count">购买数量</div>
            <div class="count_box">
              <van-stepper v-model="product.count" disable-input />
            </div>
          </div>

          <div class="desc_box fl">
            <div class="pro_desc">商品描述</div>
            <div class="desc_text">
              <div
                class="text_item"
                v-for="(item, index) in productDetail.desc"
                :key="index"
              >
                {{ index + 1 }}.{{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon
        icon="bag"
        :badge="bagCount == 0 ? '' : bagCount"
        text="购物车"
        :to="{
          name: 'Shopbag',
        }"
      />
      <van-goods-action-icon
        icon="like"
        :color="isLike ? '#e74c3c' : '#323233'"
        :text="isLike ? '已收藏' : '收藏'"
        @click="toggleLike"
      />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="addShopbag"
      />
      <van-goods-action-button type="danger" text="立即购买" />
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/less/Detail.less";
export default {
  name: "Detail",
  data() {
    return {
      pid: "", //商品pid
      showShare: false,
      bagCount: 0,
      product: {
        count: 1,
      },
      // 分享选项
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
      productDetail: {}, //商品详情数据
      isLike: false, //是否已收藏
    };
  },
  created() {
    this.pid = this.$route.params.pid;

    this.getProductDe();
    this.findLike();
    this.shopBagC();
  },
  methods: {
    // 返回
    onClickLeft() {
      //   this.$toast("返回");
      this.$router.back(-1);
    },
    // 分享
    onSelect(option) {
      this.$toast(option.name);
      this.showShare = false;
    },
    // 获取数据
    getProductDe() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // console.log(res);
          if (res.data.code == 600) {
            // localStorage.setItem("Kf_tk", res.data.token);
            let data = res.data.result[0];
            data.desc = data.desc.split(/\n/);
            let rules = [];
            let ruleData = ["tem", "sugar", "milk", "cream"];
            ruleData.map((v) => {
              let r = {};
              r.title = data[v + "_desc"];
              r.ruleIndex = 0;
              r.rule = [];
              let ruleString = data[v].split("/");
              ruleString.map((value) => {
                if (value != "") {
                  r.rule.push({ title: value });
                }
              });
              if (r.rule.length > 0) {
                rules.push(r);
              }
            });
            data.rules = rules;
            this.productDetail = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          // console.log(err);
        });
    },
    // 切换选项
    toggleRule(item, i) {
      if (item.ruleIndex == i) {
        return;
      }
      item.ruleIndex = i;
    },
    findLike() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return;
      }
      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      }).then((res) => {
        // console.log("res=>", res);
        if (res.data.code == 1000 && res.data.result.length > 0) {
          this.isLike = true;
        }
      });
    },
    toggleLike() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      let url = this.isLike ? "/notlike" : "/like";
      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      }).then((res) => {
        // console.log(res.data);
        if (res.data.code == 700) {
          this.$route.push({ name: "Login" });
        } else if (res.data.code == 800) {
          this.isLike = true;
        } else if (res.data.code == 900) {
          this.isLike = false;
        }
      });
    },
    addShopbag() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      let data = {
        tokenString,
        appkey: this.appkey,
        count: this.product.count,
        pid: this.pid,
      };
      let prodata = [];
      // console.log(this.productDetail.rules);
      this.productDetail.rules.map((v) => {
        prodata.push(v.rule[v.ruleIndex].title);
      });
      data.rule = prodata.join("/");
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      }).then((res) => {
        if (res.data.code == 700) {
          this.$route.push({ name: "Login" });
        } else if (res.data.code == 3000) {
          if (res.data.status == 1) {
            this.bagCount++;
          }
        }
        this.$toast(res.data.msg);
      });
    },
    shopBagC() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "GET",
        url: "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == 8000) {
          this.bagCount = res.data.result;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>