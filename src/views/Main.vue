<template>
  <div class="main">
    <div class="main_box">
      <router-view></router-view>
    </div>
    <van-tabbar
      v-model="activeName"
      active-color="#3498db"
      inactive-color="#606468"
      route
    >
      <van-tabbar-item
        :icon="item.icon"
        v-for="(item, index) in tabbarData"
        :key="index"
        :name="item.name"
        replace
        :to="item.path"
        >{{ item.title }}</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      activeName: "Home", //激活的标签名称
      tabbarData: [
        {
          title: "首页",
          icon: "home-o",

          name: "Home",
          path: "/main/home",
        },
        {
          title: "菜单",
          icon: "orders-o",
          name: "Menu",
          path: "/main/menu",
        },
        {
          title: "购物袋",
          icon: "shopping-cart-o",
          name: "Shopbag",
          path: "/main/shopbag",
        },
        {
          title: "我的",
          icon: "friends-o",
          name: "My",
          path: "/main/my",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.main_box {
  padding-bottom: 40px;
}
</style>
