// 前端航栏
module.exports = {
  text: 'NAS',
  link: '/nas/', // 目录页链接，此处 link 是 vdoing 主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
  items: [
    // 说明：以下所有 link 的值只是在相应 md 文件定义的永久链接（不是什么特殊生成的编码）。另外，注意结尾是有斜杠的
    {
      text: '极空间',
      items: [
        { text: 'NAS', link: '/note/nas/'}
      ]
    }
  ]
}
