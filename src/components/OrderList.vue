<template>
  <div class="orderlist">
    <div class="pro_box">
      <div class="info_boxs">
        <!-- 上部分 -->
        <div class="info_title">{{ titleLeft }}</div>
        <div class="info_confirm" v-if="isRight">
          <div v-if="!isReceive" @click="confirm">确认收货</div>
          <div class="info_carry" v-else>
            <div class="carry">已完成</div>
            <van-icon name="delete" @click="remove" />
          </div>
        </div>
      </div>
      <div class="cell_list">
        <slot></slot>
      </div>
      <div class="bottom_init">
        <div class="Round">
          <div class="r_l"></div>
          <div class="r_r"></div>
        </div>
        <div class="date" v-if="data != ''">{{ data }}</div>
        <div class="close">
          <div class="amount">共计{{ count }} 件</div>
          <div class="total">合计 ￥{{ total }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderList",
  props: {
    titleLeft: {
      type: String,
      default: "标题",
    },
    isRight: {
      type: Boolean,
      default: true,
    },
    data: {
      type: String,
      default: "2020-11-13 19:55",
    },
    count: {
      type: Number,
      default: 1,
    },
    total: {
      type: [Number, String],
      default: 0,
    },
    isReceive: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    confirm() {
      this.$emit("confirm_receive");
    },
    remove() {
      this.$emit("remove");
    },
  },
};
</script>

<style lang="less" scoped>
.pro_box {
  background-color: white;
  .info_boxs {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .info_carry {
      display: flex;
      align-items: center;
      padding: 0 5px;
      div:first-child {
        margin-right: 10px;
      }
    }
  }
  .cell_list {
    padding-bottom: 20px;
    border-bottom: 1px dashed #d3d3d3ce;
  }
  .bottom_init {
    padding: 10px;
    font-size: 14px;
    position: relative;
    .Round {
      > div {
        position: absolute;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #ecf0f1;
        top: -8px;
      }
      .r_l {
        left: -7px;
      }
      .r_r {
        right: -7px;
      }
    }
    .close {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>