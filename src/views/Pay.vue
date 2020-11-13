<template>
  <div class="pay">
    <van-nav-bar
      title="提交订单"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <div class="pay_box">
      <div class="address_box">
        <van-cell title="选择收货地址" is-link />
        <div class="user_box">
          <div class="user_info">
            <div class="user_name">张三</div>
            <div class="user_phone">13800138000</div>
          </div>
          <div class="address_info">
            <div class="tag">默认</div>
            <div class="default_address">
              广东省广州市天河区广东省广州市天河区广东省广州市天河区
            </div>
          </div>
        </div>
      </div>
      <div class="order_info"></div>
    </div>
  </div>
</template>

<script>
import "../assets/less/pay.less";
export default {
  name: "Pay",
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="less" scoped>
</style>