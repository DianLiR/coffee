<template>
  <div class="collect">
    <van-nav-bar
      left-text="返回"
      fixed
      left-arrow
      title="我的收藏"
      @click-left="goState"
    ></van-nav-bar>
    <Bgbox>
      <div v-if="likeData.length > 0">
        <div
          v-for="(item, index) in likeData"
          :key="index"
          class="proitem_s clearfix"
          @click="goDetail(item.pid)"
        >
          <Proitem
            :item="item"
            @remove="remove_like(item.pid, index)"
            :is_remove="true"
          ></Proitem>
        </div>
      </div>
      <div v-else><van-empty description="无收藏内容"></van-empty></div>
    </Bgbox>
  </div>
</template>

<script>
import Bgbox from "../../components/Bgbox";
import Proitem from "../../components/Proitem";
export default {
  name: "collect",
  components: {
    Bgbox,
    Proitem,
  },
  data() {
    return {
      islikepro: true,
      likeData: [],
    };
  },
  created() {
    this.getlikePro();
  },
  methods: {
    goState() {
      this.$router.back(-1);
    },
    getlikePro() {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 检查是否登录↑
      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 2000) {
          this.likeData = res.data.result;
        }
      });
    },
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
    remove_like(pid, index) {
      let tokenString = localStorage.getItem("Kf_tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          pid,
          tokenString,
        },
      }).then((res) => {
        if (res.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (res.data.code == 900) {
          this.likeData.splice(index, 1);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.collect {
  .proitem_s {
    float: left;
    width: calc(~"100% / 3 - 10px + 10px / 3");
    margin-right: 10px;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
