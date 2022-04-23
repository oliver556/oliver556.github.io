// 前端
const frontEdnNav = require('../nav/frontEndNav');
// 框架
// const frameNav = require('../nav/frameNav');
// 开发
const devNav = require('../nav/devNav');
// 索引
const indexNav = require("../nav/indexNav");

module.exports = [
  {
    text: '首页', link: '/'
  },
  {
    text: '导航站', link: '/navigation/'
  },
  frontEdnNav,
  // frameNav,
  devNav,
  indexNav, // 索引导航
]
