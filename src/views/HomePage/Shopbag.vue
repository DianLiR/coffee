<template>
  <div class="shopbag">
    <van-nav-bar
      title="购物袋"
      right-text="编辑"
      left-arrow
      left-text="返回"
      fixed
      @click-left="onClickLeft"
      @click-right="isEdit = !isEdit"
    >
      <template #right>
        <!-- 切换模式 -->
        <div v-if="allshopdata.length > 0">{{ isEdit ? "完成" : "编辑" }}</div>
      </template>
    </van-nav-bar>
    <div class="Shopbag_ad">
      <!-- 头部广告 -->
      <van-image
        width="10rem"
        fit="contain"
        lazy-load
        :src="require('../../assets/images/shopbag_bg.png')"
      />
    </div>
    <div v-if="allshopdata.lenngth == 0">
      <van-empty description="购物袋空空如也,先去逛一逛" />
    </div>

    <div v-else class="shopbag_box">
      <div class="shopbag_pro">
        <div
          class="shopbag_item"
          v-for="(item, index) in allshopdata"
          :key="index"
        >
          <van-swipe-cell :disabled="!isEdit">
            <div class="check_box">
              <van-checkbox
                checked-color="#3498db"
                v-model="item.isChecked"
                @click="simpleSelect"
              ></van-checkbox>
            </div>
            <van-card
              :price="item.price"
              lazy-load
              :desc="item.rule"
              :title="item.name"
              :thumb="item.small_img"
            >
              <template #tags>
                <van-tag plain type="danger">{{ item.type_desc }}</van-tag>
              </template>
              <template #footer>
                <!-- 数量控制 -->
                <van-stepper
                  v-model="item.count"
                  disable-input
                  @change="changeCount(item)"
                />
              </template>
            </van-card>

            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="removeOne(index, item.sid)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <van-submit-bar
        v-if="!isEdit"
        :price="total"
        @submit="commit"
        button-text="提交订单"
      >
        <van-checkbox v-model="isAllcheck" @click="AllSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>
      <van-submit-bar v-else button-text="删除商品" @submit="removeSelected">
        <van-checkbox v-model="isAllcheck" @click="AllSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import "../../assets/less/Shopbag.less";
export default {
  name: "Shopbag",
  data() {
    return {
      // 全选
      isAllcheck: false,

      //购物袋的数据
      allshopdata: [],
      isEdit: false,
      total: 0,
    };
  },
  created() {
    this.getshopdata();
    // console.log(this.allshopdata);
  },
  methods: {
    // 全选按钮
    AllSelect() {
      // 全选
      // console.log(this.allshopdata);
      this.allshopdata.map((v) => {
        // console.log(item.isChecked);
        v.isChecked = this.isAllcheck;
      });
      this.sum();
    },

    // 单选按钮
    simpleSelect() {
      this.sum();
      for (let i = 0; i < this.allshopdata.length; i++) {
        if (!this.allshopdata[i].isChecked) {
          this.isAllcheck = false;
          return;
        }
      }
      this.isAllcheck = true;
      // this.isAllcheck = this.allshopdata.every((item) => {
      //   if (!item.isChecked) {
      //     return false;
      //   }
      //   return true;
      // });
    },

    // 返回按钮
    onClickLeft() {
      //   this.$toast("返回");
      this.$router.go(-1);
    },

    // 获购物袋数据
    getshopdata() {
      // 获取token
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 检查是否登录↑
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 5000) {
          res.data.result.map((v) => {
            v.isChecked = false;
          });
          // console.log(res.data.result);
          this.allshopdata = res.data.result;
        }
      });
    },

    // 删除单个商品
    removeOne(index, sid) {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // console.log(tokenString);
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 7000) {
          this.allshopdata.splice(index, 1);
          this.sum();
        }
      });
      this.isAllcheck = this.allshopdata.some((item) => {
        // console.log(item);
        if (!item.isChecked) {
          return false;
        }
        return true;
      });
    },

    // 是否选中商品
    isSelectPro() {
      // this.allshopdata.forEach((item) => {
      //   console.log(item);
      //   if (item.isChecked) {
      //     return true;
      //   }
      // });
      for (let i = 0; i < this.allshopdata.length; i++) {
        if (this.allshopdata[i].isChecked) {
          return true;
        }
      }
      return false;
    },

    // 删除选中项
    removeSelected() {
      let isHas = this.isSelectPro();
      if (!isHas) {
        this.$toast("未选择");
        return;
      }
      let sids = [];
      this.allshopdata.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: "deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 7000) {
          // this.allshopdata.forEach((item, i) => {
          //   if (item[i].isChecked) {
          //     this.allshopdata.splice(i, 1);
          //   }
          // });
          for (let i = 0; i < this.allshopdata.length; i++) {
            if (this.allshopdata[i].isChecked) {
              this.allshopdata.splice(i, 1);
              i--;
            }
          }
          this.sum();
        }
        this.$toast(res.data.msg);
      });
    },

    // 数量修改
    changeCount(item) {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 6000) {
          if (item.isChecked) {
            this.sum();
          }
        }
      });
    },

    // 计算总额
    sum() {
      this.total = 0;
      this.allshopdata.map((item) => {
        if (item.isChecked) {
          this.total += item.price * item.count;
        }
      });
      this.total *= 100;
    },

    // 提交订单按钮
    commit() {
      let isHas = this.isSelectPro();
      if (!isHas) {
        this.$toast("未选择商品");
        return;
      }
      let sids = [];
      this.allshopdata.map((item) => {
        if (item.isChecked) {
          sids.push(item.sid);
        }
      });
      this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
    },
  },
};
</script>

<style lang="less" scoped></style>
