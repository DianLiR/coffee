<template>
  <div class="menu">
    <div class="menu_nav">
      <div class="menu_search">
        <van-search
          shape="round"
          placeholder="请输入搜索关键词"
          @focus="searchF"
        />
      </div>
      <div class="menu_option">
        <div
          class="menu_item"
          v-for="(item, index) in menuOptions"
          :key="index"
          @click="toggletab(index, item.type)"
        >
          <div class="m_item">
            <div class="m_icon">
              <img
                :src="
                  menuIndex == index ? item.activeIcon : item.activeIconInit
                "
              />
            </div>
            <div class="m_text" :class="{ active: menuIndex == index }">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="menu_product">
      <div
        class="m_pro_item"
        v-for="(item, i) in productData"
        :key="i"
        @click="goDetail(item.pid)"
      >
        <div class="pro_img">
          <img :src="item.smallImg" alt="" />
        </div>
        <div class="pro_text">
          <div class="pro_name">{{ item.name }}</div>
          <div class="pro_enname">{{ item.enname }}</div>
        </div>
        <div class="price">￥{{ item.price }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleName from "../../assets/less/menu.less"
export default {
  name: "Menu",
  data () {
    return {
      productData: [],
      menuIndex: 0,
      menuOptions: [
        {
          title: "推荐",
          activeIconInit: require("../../assets/images/icons_09.gif"),
          activeIcon: require("../../assets/images/icons_21.gif"),
        },
        {
          title: "拿铁",
          activeIconInit: require("../../assets/images/icons_05.gif"),
          activeIcon: require("../../assets/images/icons_19.gif"),
        },
        {
          title: "咖啡",
          activeIconInit: require("../../assets/images/icons_03.gif"),
          activeIcon: require("../../assets/images/icons_18.gif"),
        },
        {
          title: "瑞纳冰",
          activeIconInit: require("../../assets/images/icons_07.gif"),
          activeIcon: require("../../assets/images/icons_20.gif"),
        },
      ],
    }
  },
  created () {
    this.getType()
  },
  methods: {
    toggletab (index, type) {
      if (this.menuIndex == index) {
        return
      }
      this.menuIndex = index
      this.getProductType(type)
    },
    getType () {
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      }).then((res) => {
        if (res.data.code == 400) {
          let data = res.data.result
          data.unshift({
            type: "isHot",
            typeDesc: "推荐",
          })
          this.menuOptions.map((item) => {
            for (let i = 0; i < data.length; i++) {
              if (item.title == data[i].typeDesc) {
                item.type = data[i].type
                break
              }
            }
          })
          let type = this.menuOptions[this.menuIndex].type
          this.getProductType(type)
        }
      })
    },
    getProductType (type) {
      let params = {
        appkey: this.appkey,
      }
      if (type == "isHot") {
        params.key = "isHot"
        params.value = 1
      } else {
        params.key = "type"
        params.value = type
      }
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      }).then((res) => {
        if (res.data.code == 500) {
          this.productData = res.data.result
        }
      })
    },
    goDetail (pid) {
      this.$router.push({ name: "Detail", params: { pid } })
    },
    searchF () {
      this.$router.push({ name: "Search" })
    },
  },
};
</script>

<style lang="less" scoped></style>
