<template>
  <div class="orderitem">
    <van-card
      :price="item.price"
      lazy-load
      :desc="item.rule"
      :title="item.name"
      :thumb="item.small_img || item.smallImg"
      :num="item.count"
    >
      <template #tags>
        <van-tag plain type="primary" color="#7232dd" v-if="item.type_desc">{{
          item.type_desc
        }}</van-tag>
      </template>
    </van-card>
  </div>
</template>

<script>
export default {
  name: "OrderItem",
  created() {
    // console.log(this.item);
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          price: 30,
          type_desc: "咖啡",
          desc: "",
          rule: "无糖",
          name: "咖啡",
          small_img:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0389_02p.jpg",
          count: 1,
        };
      },
    },
  },
};
</script>

<style lang="less" scoped>
.orderitem {
  /deep/.van-card {
    background-color: white;
  }
  /deep/.van-card__price {
    color: #1ea1d4;
  }
  /deep/ .van-card__desc {
    color: gray;
  }
  /deep/.van-card__num {
    margin-right: 10px;
  }
}
</style>