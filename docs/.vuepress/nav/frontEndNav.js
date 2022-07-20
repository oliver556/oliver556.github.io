// 前端航栏
module.exports = {
  text: '前端',
  link: '/web/', // 目录页链接，此处 link 是 vdoing 主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
  items: [
    // 说明：以下所有 link 的值只是在相应 md 文件定义的永久链接（不是什么特殊生成的编码）。另外，注意结尾是有斜杠的
    {
      text: '学习专栏',
      items: [
        { text: '《HTML》笔记', link: '/note/html/'},
        { text: '《CSS》笔记', link: '/note/css/'},
        { text: '《JavaScript》笔记', link: '/note/javascript/'},
        { text: '《Vue》笔记', link: "/note/vue/" },
        { text: '《Git》笔记', link: '/note/git/'},
        { text: '《规范》笔记', link: '/note/specification/'},
        { text: '《软技能》笔记', link: '/note/softSkill/'},
        { text: '《面试》笔记', link: '/note/interview/'},
      ]
    },
    {
      text: '踩坑专栏',
      items: [
        { text: '《Element-UI 实践系列》笔记', link: '/note/element-ui/'},
        { text: '《移动端 实践系列》笔记', link: '/note/mobile/'},
        { text: '《综合》笔记', link: '/note/complex/'},
      ]
    },
    {
      text: '配置专栏',
      items: [
        { text: '《环境系列》笔记', link: '/node/environment/' }
      ]
    }
  ]
}
