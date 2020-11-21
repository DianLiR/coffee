<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
// @color_b: #3498db;
// @color_r: #e74c3c;
// @color_c: #e67e22;
// @color_w: #ecf0f1;/
// @color_s: #bdc3c7;
// @color_e: #2ecc71;
body {
  background-color: #ecf0f1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #34495e;
  max-width: 495px;
  // text-align: center;
  // padding: 50px 0;
}
.auto_img {
  display: block;
  height: 100%;
  width: 100%;
}

.Text_abb {
  //设置文本缩略
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 清除触摸高亮 */
* {
  -webkit-tap-highlight-color: transparent;
}
input {
  -webkit-appearance: none;
}
img,
a {
  -webkit-touch-callout: none;
}
a {
  text-decoration: none;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
img {
  vertical-align: middle;
}
div {
  box-sizing: border-box;
}
.clearfix:after {
  content: "";
  display: block;
  line-height: 0;
  visibility: hidden;
  height: 0;
  clear: both;
}
.clearfix {
  *zoom: 1;
}
em,
i {
  font-style: normal;
}
textarea {
  resize: none;
}
.fl {
  display: flex;
}
</style>
