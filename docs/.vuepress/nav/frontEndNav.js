// 前端航栏
module.exports = {
  text: '前端',
  link: '/web/', // 目录页链接，此处 link 是 vdoing 主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
  items: [
    // 说明：以下所有link的值只是在相应md文件定义的永久链接（不是什么特殊生成的编码）。另外，注意结尾是有斜杠的
    {
      text: '学习笔记',
      items: [
        { text: '《JavaScript 深入系列》笔记', link: '/note/javascript/'}
      ]
    },
    {
      text: '踩坑笔记',
      items: [
        { text: '《Element-UI 实践系列》笔记', link: '/note/element-ui/'},
        { text: '《移动端 实践系列》笔记', link: '/note/mobile/'},
        { text: '《Git》笔记', link: '/note/git/'}
      ]
    },
  ]
}
