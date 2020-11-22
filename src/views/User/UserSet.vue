<template>
  <div class="userset">
    <van-nav-bar
      left-text="返回"
      fixed
      left-arrow
      title="个人信息"
      @click-left="goState"
    >
    </van-nav-bar>
    <Bgbox>
      <van-cell title="头像" class="Avatar">
        <template #right-icon>
          <van-image
            width="40"
            :src="my.userImg"
            round
            height="40"
            fit="cover"
            show-loading
          />
          <van-uploader
            upload-icon=""
            class="up_userbg"
            :after-read="afterRead"
          />
        </template>
      </van-cell>
      <van-cell title="用户id"> {{ my.userId }}</van-cell>
      <van-cell title="手机号"> {{ my.phone }}</van-cell>
      <van-field
        v-model="my.nickName"
        label="昵称"
        placeholder="输入昵称"
        input-align="right"
        @change="updataName"
        clearable
      />
      <van-field
        rows="1"
        v-model="my.desc"
        autosize
        label="简介"
        type="textarea"
        input-align="right"
        placeholder="请输入简介"
        clearable
        @change="updataDesc"
        maxlength="25"
      />
    </Bgbox>
  </div>
</template>

<script>
import "../../assets/less/UserSet.less"
import Bgbox from "../../components/Bgbox"
export default {
  name: "UserSet",
  components: {
    Bgbox,
  },
  data () {
    return {
      my: {},
    }
  },
  created () {
    this.user_initialization()
  },
  methods: {
    goState () {
      this.$router.back(-1)
    },
    user_initialization () {
      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
      }
      // 检查是否登录↑
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" })
        } else if (res.data.code == "B001") {
          let data = res.data.result[0]
          if (data.desc == "") {
            data.desc = "这家伙很懒,什么都没有!!"
          }
          this.my = data
        }
      })
    },
    // 修改头像
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
        message: "修改中...",
        forbidClick: true,
        duration: 0
      })
      this.axios({
        method: "POST",
        url: "/updateAvatar",
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
          this.my.userImg = res.data.userImg
        }
        this.$toast(res.data.msg)
        location.reload()
      })
    },
    updataName () {
      if (!this.my.nickName) {
        this.$toast("昵称不能为空")
      }
      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
      }
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.my.nickName,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" })
        } else {
          this.$toast(res.data.msg)
        }
      })
    },
    updataDesc () {
      if (!this.my.nickName) {
        this.$toast("昵称不能为空")
      }
      let tokenString = localStorage.getItem("Kf_tk")
      if (!tokenString) {
        return this.$router.push({ name: "Login" })
      }
      // 检查是否登录↑
      this.axios({
        method: "POST",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.my.desc,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" })
        } else {
          this.$toast(res.data.msg)
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>
</style>