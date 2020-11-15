<template>
  <div class="bg-box">
    <div class="bg"></div>
    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bgbox",
};
</script>

<style lang="less" scoped>
.bg-box {
  .bg {
    height: 120px;
    background-color: #3498db;
    z-index: 0;
  }
  .box-content {
    margin: 0 15px;
    position: relative;
    top: -25px;
    background-color: white;
    border-radius: 7px;
    padding: 10px;
    overflow: hidden;
  }
}
</style>