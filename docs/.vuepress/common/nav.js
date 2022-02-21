// 导航栏
const devNav = require('../nav/devNav');
// 外链
const DTNav = require('../nav/DTNav')

module.exports = [
  {
    text: '首页', link: '/'
  },
  {
    text: '导航站', link: '/navigation/'
  },
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
