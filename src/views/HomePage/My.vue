<template>
  <div class="my">
    <div class="my_bg">
      <van-image
        width="100%"
        height="100%"
        fit="cover"
        :src="my.userBg"
        show-loading
      />
    </div>
    <div class="my_box">
      <div class="my_information">
        <div class="Avatar">
          <van-image height="100%" width="100%" fit="cover" :src="my.userImg" />
        </div>
        <div class="my_desc">
          <div class="name">{{ my.nickName }}</div>
          <div class="signature">
            {{ (my.desc = '""' ? "这个家伙很懒，什么都没留下" : my.desc) }}
          </div>
        </div>
      </div>
      <div class="information_liss">
        <van-cell title="个人资料" is-link url="#" />
        <van-cell title="我的订单" is-link to="#" />
        <van-cell title="我的收藏" is-link url="#" />
        <van-cell title="收货地址" is-link to="/Address" />
        <van-cell title="安全中心" is-link url="#" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "My",
  data() {
    return {
      my: {},
    };
  },
  created() {
    this.user_initialization();
  },
  methods: {
    user_initialization() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 检查是否登录↑
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == "A001") {
          this.my = res.data.result[0];
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.my {
  height: 92vh;
  background-color: #f5f5f5;
  .my_bg {
    height: 180px;
  }

  .my_box {
    background-color: white;
    position: relative;
    top: -60px;
    margin: auto;
    width: 90%;
    border-radius: 12px;
    padding: 10px;
    min-height: 200px;

    .my_information {
      display: flex;
      align-items: center;
      padding: 5px;
      margin-bottom: 15px;
      .Avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
      }

      .my_desc {
        margin-left: 20px;
        line-height: 35px;
        .name {
          color: skyblue;
          font-weight: bolder;
        }
        .signature {
          color: #acaaaa;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
