<template>
  <div class="proitem">
    <div>
      <van-image width="100%" height="100%" fit="cover" :src="item.smallImg" />
      <div class="item_text">
        <div class="pro_name">{{ item.name }}</div>
        <div class="pro_enname one-text">{{ item.enname }}</div>
        <div class="pro_ss">
          <div class="pro_price">{{ item.price }}</div>
          <div class="delete" v-if="isRemove" @click.stop="remove()">
            <van-icon name="delete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Proitem",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    isRemove: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    remove() {
      this.$emit("remove");
    },
  },
};
</script>

<style lang="less" scoped>
.proitem {
  //   border: 1px solid #ccc;
  text-align: center;
  .item_text {
    text-align: left;
    > div {
      margin: 2px 0;
    }
    .pro_title {
      color: #7c7d7e;
      font-size: 18px;
    }
    .pro_enname {
      color: darkgray;
      font-size: 12px;
    }
    .pro_price {
      color: deepskyblue;
      font-weight: bolder;
    }
    .one-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pro_ss {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
