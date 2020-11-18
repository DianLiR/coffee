<template>
  <div class="safety">
    <van-nav-bar
      left-text="返回"
      fixed
      left-arrow
      title="个人信息"
      @click-left="goState"
    ></van-nav-bar>
    <Bgbox>
      <van-cell title="修改密码" is-link @click="open_pass" />
      <van-cell title="注销账号" is-link @click="open_logout" />
    </Bgbox>
    <van-popup
      v-model="isopen_pass"
      round
      position="bottom"
      class="register-box"
      closeable
    >
      <div class="registered-title">修改密码</div>
      <van-form>
        <van-field
          v-model="password.old_p"
          name="旧密码"
          label="旧密码"
          placeholder="旧密码"
          autocomplete="off"
          clearable
          :type="isdisplay_old ? 'password' : 'text'"
          :right-icon="isdisplay_old ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleShowPass('isdisplay_old')"
        />
        <van-field
          v-model="password.new_p"
          name="新密码"
          label="新密码"
          placeholder="新密码"
          clearable
          autocomplete="off"
          :type="isdisplay_new ? 'password' : 'text'"
          :right-icon="isdisplay_new ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleShowPass('isdisplay_new')"
        />

        <div class="commit-btn registered-btn">
          <van-button round block type="default" @click="modify">
            修改
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <div class="drop_out">
      <van-button round block type="info" @click="drop_out"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import { verification } from "../../assets/js/verification";
import Bgbox from "../../components/Bgbox";
export default {
  name: "Safety",
  components: {
    Bgbox,
  },
  data() {
    return {
      isopen_pass: false,
      isopen_logout: false,
      isdisplay_old: true,
      isdisplay_new: true,
      password: {
        old_p: "",
        new_p: "",
      },
    };
  },
  methods: {
    goState() {
      // 返回
      this.$router.back(-1);
    },
    open_pass() {
      // 显示弹窗
      this.isopen_pass = true;
    },
    toggleShowPass(type) {
      // 切换密码
      this[type] = !this[type];
    },
    open_logout() {
      // 点击注销
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确认注销账号,注销无法恢复",
        })
        .then(() => {
          let tokenString = localStorage.getItem("Kf_tk");
          if (!tokenString) {
            return this.$router.push({ name: "Login" });
          }
          // 检查是否登录↑
          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString,
            },
          }).then((res) => {
            if (res.data.code == 700) {
              this.$router.push({ name: "Login" });
            } else if (res.data.code == "G001") {
              setTimeout(() => {
                localStorage.removeItem("Kf_tk");
                this.$router.push({ name: "Home" });
              }, 300);
            }
            this.$toast(res.data.msg);
          });
        });
    },

    modify() {
      // 修改按钮
      let o = {
        old_password: {
          value: this.password.old_p,
          errorMsg: "旧密码格式错误",
          // 密码强度校验，最少6位，包括至少1个大写字母，1个小写字母，1个数字
          reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/,
        },
        new_password: {
          value: this.password.new_p,
          errorMsg: "新密码格式错误",
          // 密码强度校验，最少6位，包括至少1个大写字母，1个小写字母，1个数字
          reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/,
        },
      };
      let ispass = verification.valid(o);
      if (ispass) {
        if (this.password.old_p == this.password.new_p) {
          this.$toast("密码不能相同");
          return;
        }

        let tokenString = localStorage.getItem("Kf_tk");
        if (!tokenString) {
          return this.$router.push({ name: "Login" });
        }

        this.axios({
          method: "POST",
          url: "/updatePassword",
          data: {
            appkey: this.appkey,
            tokenString,
            password: this.password.new_p,
            oldPassword: this.password.old_p,
          },
        }).then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "E001") {
            setTimeout(() => {
              //清除登录状态
              localStorage.removeItem("kf_tk");
              this.$router.push({ name: "Login" });
            }, 800);
          }

          this.$toast(result.data.msg);
        });
      }
    },

    drop_out() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "确认退出当前账号",
        })
        .then(() => {
          setTimeout(() => {
            localStorage.removeItem("Kf_tk");
            this.$router.push("Home");
          }, 500);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.safety {
  .drop_out {
    margin-top: 250px;
    width: 100vw;
    /deep/ .van-button {
      width: 80%;
      margin: auto;
    }
  }
  .register-box {
    padding: 20px 0px;
    // border-radius: 15px;
    // border-top-left-radius: 15px;
    // border-top-right-radius: 15px;

    .van-form {
      box-sizing: border-box;
      padding: 0 30px;
    }

    .registered-btn {
      margin-top: 15px;
      // padding: 0 15px;
    }

    .registered-title {
      font-size: 24px;
      font-weight: bold;
      padding: 0 15px;
      margin-bottom: 10px;
    }
  }
}
</style>