<template>
  <div class="AddressSet">
    <van-nav-bar
      :title="aid ? '地址编辑' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="goState"
    />
    <van-address-edit
      :show-delete="!!aid"
      :area-list="areaList"
      show-set-default
      show-postal
      :address-info="addressInfo"
      save-button-text="确认"
      delete-button-text="删除收货地址"
      @save="save"
      @delete="removeAddress"
    />
  </div>
</template>
<script>
import areaList from "../../assets/js/Area";
export default {
  name: "AddressEdit",
  data() {
    return {
      areaList,
      aid: "",
      addressInfo: {},
    };
  },
  created() {
    this.aid = this.$route.query.aid;
    // if (this.aid) {
    this.getAddressDataAid();
    // }
  },
  methods: {
    goState() {
      this.$router.back(-1);
    },

    save(content) {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      let addressInfo = Object.assign({}, content);
      // delete addressInfo.county;

      addressInfo.tokenString = tokenString;
      addressInfo.appkey = this.appkey;
      addressInfo.isDefault = Number(addressInfo.isDefault);

      if (!this.aid) {
        this.address(addressInfo, "/addAddress");
        // 新增模式
      } else {
        // 否则编辑模式
        let isModify = false;
        for (const key in this.addressInfo) {
          if (content[key] != this.addressInfo[key]) {
            isModify = true;
            // 判断是否编辑过内容
          }
        }
        if (isModify) {
          this.address(addressInfo, "/editAddress");
        } else {
          return this.$toast("未修改内容");
        }
      }
    },
    address(addressInfo, url) {
      this.axios({
        method: "POST",
        url,
        data: addressInfo,
      }).then((res) => {
        if (res.data.code == 700) {
          this.$route.push({ name: "Login" });
        } else if (res.data.code == 9000 || res.data.code == 30000) {
          setTimeout(() => {
            this.$router.push({ name: "Address" });
          }, 500);
        }
        this.$toast(res.data.msg);
      });
    },
    getAddressDataAid() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 检查是否登录↑
      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 40000) {
          let data = res.data.result[0];
          // console.log("data=>", res);
          data.isDefault = Boolean(data.isDefault);
          this.addressInfo = data;
        }
      });
    },

    removeAddress() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 10000) {
          setTimeout(() => {
            this.$router.push({ name: "Address" });
          }, 500);
        }
        this.$toast(res.data.msg);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.AddressSet {
  padding-top: 46px;
  /deep/ .van-button--danger {
    background-color: #3498db;
    border-color: #3498db;
  }
}
</style>