// 导航栏
const devNav = require('../nav/devNav');
// 框架
const frameNav = require('../nav/frameNav');
// 外链
const DTNav = require('../nav/DTNav');

module.exports = [
  {
    text: '首页', link: '/'
  },
  {
    text: '导航站', link: '/navigation/'
  },
  frameNav,
  devNav,
  DTNav,
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
