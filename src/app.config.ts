export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/battle/index',
    'pages/battle/ptcg-battle',
    'pages/battle/opcg-battle',
    'pages/battle/cross-battle',
    'pages/trade/index',
    'pages/trade/detail',
    'pages/trade/search',
    'pages/trade/rank',
    'pages/mine/index',
    'pages/mine/collection',
    'pages/mine/deck',
    'pages/mine/battle-history',
    'pages/mine/alerts',
    'pages/mine/authentication',
    'pages/mine/community'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1A1A2E',
    navigationBarTitleText: '双海卡牌',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F0F2F5'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#2979FF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/battle/index',
        text: '对战'
      },
      {
        pagePath: 'pages/trade/index',
        text: '交易'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})