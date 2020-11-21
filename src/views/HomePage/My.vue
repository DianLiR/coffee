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
      <van-uploader class="up_userbg" :after-read="afterRead" />
    </div>
    <div class="my_box">
      <div class="my_information">
        <div class="Avatar">
          <van-image height="100%" width="100%" fit="cover" :src="my.userImg" />
        </div>
        <div class="my_desc">
          <div class="name">{{ my.nickName }}</div>
          <div class="signature van-multi-ellipsis--l2">
            {{ my.desc || "这家伙很懒，什么也没有留下！" }}
          </div>
        </div>
      </div>
      <div class="information_liss">
        <van-cell
          :title="item.title"
          is-link
          :to="item.to"
          v-for="(item, index) in userInfo"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "My",
  data () {
    return {
      userInfo: [
        { title: "个人资料", to: "/userset" },
        { title: "我的订单", to: "/Order" },
        { title: "我的收藏", to: "/Collect" },
        { title: "收货地址", to: "/Address" },
        { title: "安全中心", to: "/Safety" },
      ],
      my: {},
    }
  },
  created () {
    this.user_initialization()

  },
  methods: {
    user_initialization () {
      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
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
          this.$router.push({ name: "Login" })
        } else if (res.data.code == "A001") {
          this.my = res.data.result[0]

        }
      })
    },
    afterRead (file) {
      let type = ["gif", "png", "jpg", "jpeg"]

      let size = 1
      let fileType = file.file.type.split("/")[1]
      if (type.indexOf(fileType) === -1) {
        this.$toast(`当前文件格式不支持,仅支持${type.join(",")}`)
        return
      }
      let fileSize = file.file.size / 1024 / 1024
      if (fileSize > size) {
        this.$toast(`文件不允许超过${size}MB`)
        return
      }
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "")

      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      })
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      }).then((res) => {
        this.$toast.clear()
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" })
        } else if (res.data.code == "I001") {
          this.my.userBg = res.data.userBg
        }
        this.$toast(res.data.msg)
        location.reload()
      })
    },
  },
};
</script>

<style lang="less" scoped>
.my {
  height: 92vh;
  background-color: #e7e7e733;
  .my_bg {
    height: 180px;
    position: relative;

    .up_userbg {
      position: absolute;
      opacity: 0;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      /deep/.van-uploader__wrapper {
        height: 100%;
      }
      /deep/.van-uploader__upload {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    }
  }

  .my_box {
    // background-color: white;
    background-image: linear-gradient(
      to bottom,
      #ffffff27 0,
      #ffffffb6 2.4rem,
      #fff 2.4rem,
      #fff 100%
    );
    position: relative;
    top: -60px;
    margin: auto;
    width: 90%;
    border-radius: 12px;
    padding: 10px;

    .my_information {
      display: flex;
      margin-bottom: 15px;
      .Avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
      }

      .my_desc {
        width: calc(~"100% - 100px");
        margin-left: 20px;
        display: flex;
        padding: 5px 0;
        justify-content: space-around;
        flex-direction: column;
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
