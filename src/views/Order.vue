<template>
  <div class="order">
    <van-nav-bar
      left-text="返回"
      fixed
      left-arrow
      title="我的订单"
      @click-left="goState"
    />
    <Bgbox>
      <!-- <div v-if="isHas"> -->
      <van-tabs v-model="active" animated @change="toggleTab">
        <van-tab
          v-for="(item, index) in tabList"
          :title="item.title"
          :key="index"
        >
          <div v-if="orderListData.length > 0">
            <div
              class="order_box"
              v-for="(item, index) in orderListData"
              :key="item.oid"
            >
              <Order-list
                :titleLeft="item.oid"
                :data="item.date | Time_format('yyyy-MM-dd hh:mm:ss')"
                :count="item.count"
                :total="item.total | Decimal_res"
                :isRight="true"
                :isReceive="item.status == 2"
                @confirm="confirm_order(item, index)"
                @remove="remove_order(item, index)"
              >
                <Order-item
                  v-for="(items, indexs) in item.data"
                  :key="indexs"
                  :item="items"
                ></Order-item>
              </Order-list>
            </div>
          </div>
          <div v-else>
            <van-empty description="无数据"></van-empty>
          </div>
        </van-tab>
      </van-tabs>
      <!-- </div> -->
      <!-- <div v-else>
         无数据显示
        <van-empty description="暂无订单信息"></van-empty>
      </div> -->
    </Bgbox>
  </div>
</template>

<script>
import "../assets/less/order.less"
import Bgbox from "../components/Bgbox"
import OrderList from "../components/OrderList"
import OrderItem from "../components/OrderItem"
export default {
  components: { Bgbox },
  name: "Order",
  components: {
    Bgbox,
    OrderList,
    OrderItem,
  },
  data () {
    return {
      isHas: true, //是否有订单信息

      active: 0, //tab栏默认下标
      orderListData: [],

      tabList: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
    }
  },
  created () {
    this.getOrderData()
  },
  methods: {
    goState () {
      this.$router.back(-1)
    },
    toggleTab () {
      this.getOrderData()
    },
    getOrderData () {
      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
      }
      // 检查是否登录↑
      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.active,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" })
        } else if (res.data.code == 70000) {
          if (this.active == 0 && res.data.result.length == 0) {
            this.isHas = false
            return
          }
          //
          let orderData = []
          res.data.result.map((item) => {
            for (let i = 0; i < orderData.length; i++) {
              if (orderData[i].oid == item.oid) {
                orderData[i].data.push(item)
                orderData[i].count += item.count
                orderData[i].total += item.count * item.price
                return
              }
            }
            let o = {}
            o.oid = item.oid
            o.count = item.count
            o.total = item.count * item.price
            o.status = item.status
            o.date = item.createdAt
            o.data = [item]
            orderData.push(o)
          })
          this.orderListData = orderData.reverse()
        }
      })
    },
    confirm_order (item, i) {
      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
      }
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" })
        } else if (res.data.code == 80000) {
          if (this.active == 1) {
            this.orderListData.splice(i, 1)
          }
          item.status = 2
        }
        this.$toast(res.data.msg)
      })
    },
    remove_order (item, i) {
      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
      }
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" })
        } else if (res.data.code == 90000) {
          this.orderListData.splice(i, 1)
        }
        this.$toast(res.data.msg)
      })
    },
  },
};
</script>

<style lang="less" scoped>
</style>