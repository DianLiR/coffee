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
        <van-cell title="选择收货地址" is-link @click="select_address" />
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
      <div class="order_info">
        <OrderList
          titleLeft="订单信息"
          :count="proInfo.count"
          :total="proInfo.total"
        >
          <OrderItem
            v-for="(item, index) in products"
            :key="index"
            :item="item"
          ></OrderItem>
        </OrderList>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/pay.less";
import OrderList from "../../components/OrderList";
import OrderItem from "../../components/OrderItem";
export default {
  name: "Pay",
  data() {
    return {
      isOpen: false,
      Check_address: "",
      address_list: [],
      current_address: {},
      sids: [],
      products: [],
      proInfo: {
        count: 0,
        total: 0,
      },
    };
  },
  components: {
    OrderList,
    OrderItem,
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    new_address() {
      this.$router.push({ name: "NewAddress" });
    },
    select_address() {
      this.isOpen = false;
      this.current_address = item;
    },
    show_address_list() {
      this.isOpen = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>