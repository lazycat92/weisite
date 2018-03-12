//app.js
var util = require('utils/util.js');
App({
  onLaunch: function () {
    var that = this;
    util.init(that);
    util.login(that);
    util.req('getSettings', 'get', {}, function(res) {
        if (res && res.errcode == 0 && res.items && res.items.site) {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: res.items.site.theme_color,
            })
            wx.setNavigationBarTitle({
                title: res.items.site.title,
            })
        }
    })
    
  },
  onShow: function() {
      
  },
  globalData: {
    
  }
})