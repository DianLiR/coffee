<template>
  <div class="search">
    <van-nav-bar fixed left-text="返回" left-arrow @click-left="goState">
      <template #right>
        <div>
          <van-search
            v-model="name"
            ref="search"
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @blur="onSearch"
          />
        </div>
      </template>
    </van-nav-bar>
    <Bgbox>
      <div>
        <div
          v-for="(item, index) in productData"
          :key="index"
          class="proitem_s clearfix"
          @click="goDetail(item.pid)"
        >
          <Proitem :item="item"></Proitem>
        </div>
      </div>
    </Bgbox>
  </div>
</template>

<script>
import Bgbox from "../components/Bgbox";
import Proitem from "../components/Proitem";
export default {
  name: "Search",
  components: {
    Bgbox,
    Proitem,
  },
  data() {
    return {
      name: "",
      productData: [],
    };
  },
  created() {
    this.$nextTick(() => {
      let search_ipt = this.$refs.search.querySelector('[type="search"]');
      search_ipt.focus();
    });
  },
  methods: {
    goState() {
      this.$router.back(-1);
    },
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
    onSearch() {
      if (this.name == "") return;
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.name,
        },
      }).then((res) => {
        if (res.data.code == "Q001") {
          this.productData = res.data.result;
        } else {
          this.$toast(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  /deep/ .van-nav-bar__right {
    width: calc(~"100% - 80px");
  }
  /deep/ .van-search {
    padding: 0;
    overflow: hidden;
    border-radius: 20px;
  }
  .proitem_s {
    float: left;
    width: calc(~"100% / 3 - 10px + 10px / 3");
    margin: 0 10px 10px 0;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  .van-icon {
    color: #3498db;
  }
}
</style>