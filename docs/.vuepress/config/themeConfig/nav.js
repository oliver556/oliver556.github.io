// 导航栏
module.exports = [
  { text: '首页', link: '/' },
  {
    text: 'DEV',
    link: '/comprehensive/',
    items: [
      {
        text: '开发系列',
        items: [
          { text: '程序员系列', link: '/pages/24da43/'}
        ]
      }
    ]
  },
  {
    text: '前端',
    link: '/web/', //目录页链接，此处link是vdoing主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
    items: [
      // 说明：以下所有link的值只是在相应md文件定义的永久链接（不是什么特殊生成的编码）。另外，注意结尾是有斜杠的
      {
        text: '前端文章',
        items: [
          { text: 'JavaScript', link: '/pages/8143cc480faf9a11/' },
          { text: 'Vue', link: '/pages/5d463fbdb172d43b/' },
          { text: 'CSS', link: '/pages/0a83b083bdf257cb/' },
        ],
      },
      {
        text: '学习笔记',
        items: [
          { text: '《JavaScript教程》笔记', link: '/note/javascript/' },
          { text: '《JavaScript高级程序设计》笔记', link: '/note/js/' },
          { text: '《ES6 教程》笔记', link: '/note/es6/' },
          { text: '《Vue》笔记', link: '/note/vue/' },
          {
            text: '《TypeScript 从零实现 axios》',
            link: '/note/typescript-axios/',
          },
          {
            text: '《Git》学习笔记',
            link: '/note/git/',
          },
          {
            text: '《TypeScript》笔记',
            link: '/pages/51afd6/',
          },
        ],
      },
    ],
  },
  // {
  //   text: '页面',
  //   link: '/ui/',
  //   items: [
  //     // { text: 'HTML', link: '/pages/8309a5b876fc95e3/' },
  //     { text: 'CSS', link: '/pages/0a83b083bdf257cb/' },
  //   ],
  // },
  {
    text: '技术',
    link: '/technology/',
    items: [
      { text: '技术文档', link: '/pages/9a7ee40fc232253e/' },
      { text: 'GitHub技巧', link: '/pages/4c778760be26d8b3/' },
      { text: 'Nodejs', link: '/pages/117708e0af7f0bd9/' },
      { text: '博客搭建', link: '/pages/41f87d890d0a02af/' },
    ],
  },
  {
    text: '更多',
    link: '/more/',
    items: [
      { text: '学习', link: '/pages/f2a556/' },
      { text: '面试', link: '/pages/aea6571b7a8bae86/' },
      { text: '心情杂货', link: '/pages/2d615df9a36a98ed/' },
      { text: '实用技巧', link: '/pages/baaa02/' },
      { text: '友情链接', link: '/friends/' },
    ],
  },
  { text: '关于', link: '/about/' },
  {
    text: '收藏',
    link: '/pages/beb6c0bd8a66cea6/',
    items: [
      { text: '网站', link: '/pages/beb6c0bd8a66cea6/' },
      { text: '资源', link: '/pages/eee83a9211a70f9d/' },
      { text: 'Vue资源', link: '/pages/12df8ace52d493f6/' },
    ],
  },
  {
    text: '索引',
    link: '/archives/',
    items: [
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
    ],
  },
  {
    text: 'D&T ', icon: 'reco-document',
    items: [
      {
        text: '官方文档',
        items: [
          {
            text: 'Vue',
            // icon: 'iconfont icon-vue',
            link: 'https://cn.vuejs.org/'
          },
          {
            text: 'Vue3',
            // icon: 'iconfont icon-vue',
            link: 'https://v3.cn.vuejs.org/guide/composition-api-introduction.html'
          },
          {
            text: 'Webpack',
            // icon: 'iconfont icon-webpack',
            link: 'https://www.webpackjs.com/'
          },
          {
            text: 'MDN',
            link: 'https://developer.mozilla.org/zh-CN/'
          },
          {
            text: 'Node中文网',
            // icon: 'iconfont icon-node',
            link: 'http://nodejs.cn/api/'
          },
          {
            text: 'React',
            // icon: 'iconfont icon-react',
            link: 'https://react.docschina.org/'
          },
          {
            text: '小程序',
            // icon: 'iconfont icon-xiaochengxu',
            link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/'
          },
        ]
      },
      {
        text: '学习面试',
        items: [
          {
            text: '现代 JavaScript 教程',
            link: 'https://zh.javascript.info/'
          },
          {
            text: 'ES6',
            // icon: 'iconfont icon-es',
            link: 'https://es6.ruanyifeng.com/'
          },
          {
            text: '阿西河',
            link: 'https://www.axihe.com/'
          },
          {
            text: 'LeetCode',
            link: 'https://leetcode-cn.com/'
          },
          {
            text: '牛客网',
            link: 'https://www.nowcoder.com/'
          },
          {
            text: 'Vue.js 技术揭秘',
            link: 'https://ustbhuangyi.github.io/vue-analysis/'
          }
        ]
      },
      {
        text: 'Common sites🎈',
        items: [
          // {
          //   text: '✔ 友 链 →',
          //   link: '/other/friends',
          // },
          // {
          //   text: 'Stackoverflow',
          //   link: 'https://stackoverflow.com/',
          // },
          {
            text: 'BootCDN',
            link: 'https://www.bootcdn.cn/',
          },
          {
            text: 'Linux命令大全',
            // icon: 'iconfont icon-linux',
            link: 'https://www.linuxcool.com/',
          },
          // {
          //   text: '编程语言排行榜',
          //   link: 'https://www.tiobe.com/tiobe-index/',
          // }
        ]
      },
      {
        text: '工具',
        items: [
          {
            text: 'bejson',
            link: 'https://www.bejson.com/'
          }
        ]
      }
    ]
  },
  {
    text: 'Contact', icon: 'reco-message',
    items: [
      {
        text: 'About',
        icon: 'reco-account',
        link: '/about/',
      },
      {
        text: 'Github',
        icon: 'reco-github',
        link: 'https://github.com/oliver556',
      }
    ]
  }
]
