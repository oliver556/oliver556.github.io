// head
module.exports = [
  // https://github.com/PipecraftNet/jsdelivr-auto-fallback 【修复 cdn.jsdelivr.net 无法访问的问题】
  // ['script', { src: './js/jsdelivr-auto-fallback.js', defer: 'defer' }],
  // 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]e
  ['link', { rel: 'stylesheet', href: '//at.alicdn.com/t/font_3114978_qe0b39no76.css' }], // 阿里在线矢量库
  ['link', { rel: 'icon', href: '/common/avatar.jpg' }], //favicons，资源放在public文件夹
  [
    'meta',
    {
      name: 'keywords',
      content: '前端博客,个人技术博客,前端,前端开发,前端框架,web前端,前端面试题,技术文档,学习,面试,JavaScript,js,ES6,TypeScript,vue,python,css3,html5,Node,git,github,markdown',
    },
  ],
  ['meta', { name: 'theme-color', content: '#11a8cd' }], // 移动浏览器主题颜色
  // [
  //   'script',
  //   {
  //     'data-ad-client': 'ca-pub-7828333725993554',
  //     async: 'async',
  //     src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
  //   },
  // ], // 网站关联Google AdSense 与 html格式广告支持
  // Chrome 85 版本中，为了保护用户的隐私，默认的 Referrer Policy 则变成了 strict-origin-when-cross-origin
  ['link', { rel: 'stylesheet', href: 'https://at.alicdn.com/t/font_3077305_pt8umhrn4k9.css' }],
  ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
  // ['link', { href: "https://cdn.staticaly.com/npm/@docsearch/css@3", rel: "stylesheet" }],
  // ['script', { src: "https://cdn.staticaly.com/npm/@docsearch/js@alpha" }]
]
