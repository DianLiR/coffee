<template>
  <div class="address">
    <van-nav-bar
      left-text="返回"
      fixed
      left-arrow
      title="地址管理"
      @click-left="goState"
    >
    </van-nav-bar>
    <Bgbox>
      <van-address-list
        :list="addList"
        default-tag-text="默认"
        :switchable="false"
        @add="add"
        @edit="edit"
      />
    </Bgbox>
  </div>
</template>

<script>
import Bgbox from "../../components/Bgbox.vue";
export default {
  name: "Address",
  components: {
    Bgbox,
  },
  data() {
    return {
      chosenAddressId: "",
      addList: [],
    };
  },
  created() {
    this.getAddressData();
  },
  methods: {
    goState() {
      this.$router.back(-1);
    },

    // 获取地址列表
    getAddressData() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 检查是否登录↑
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 20000) {
          res.data.result.map((item) => {
            item.isDefault = Boolean(item.isDefault);
            item.id = item.id;
            item.address = `${item.province}${item.city}${item.county}${item.addressDetail}`;
          });
          console.log("addlist=>>>", res.data.result);
          this.addList = res.data.result;
        }
      });
    },

    add() {
      this.$router.push({ name: "AddressSet" });
    },
    edit(item) {
      this.$router.push({ name: "AddressSet", query: { aid: item.aid } });
    },
  },
};
</script>

<style lang="less" scoped>
.address {
  /deep/ .van-address-list {
    padding: 0;
  }
  /deep/ .van-tag--danger {
    background-color: #3498db;
  }
  /deep/ .van-address-item {
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: none;
    }
  }
  /deep/ .van-button--danger {
    background-color: #3498db;
    border-color: #3498db;
  }
  /deep/ .van-address-item__tag {
    padding: 0 6px;
  }
}
</style>