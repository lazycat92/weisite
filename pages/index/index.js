var app = getApp()
var util = require('../../utils/util.js');
Page({
  data:{
    theme_color: '#fff',
    slider_is_show: 0,
    slider_height: 200,
    slider_items: [],
    nav_is_show: 0,
    nav_style: 'style_1',
    nav_items: [],
    notice_is_show: 0,
    notice_icon: '',
    notice_content: '',
    category_is_show: 0,
    category_items: []
  },
  onLoad:function(options){
    var that = this
    util.req('getSettings', 'get', {}, function (res) {
        if (res && res.errcode == 0) {
            if (res.items) {
                var site = res.items.site;
                var index_show = res.items.index_show;
                var tabbar = res.items.tabbar;

                if (site) {
                    that.setData({
                        theme_color: site.theme_color,
                        copyright: site.copyright
                    })
                }
                
                if (index_show) {
                    that.setData({
                        slider_is_show: index_show.slider_is_show,
                        slider_height: index_show.slider_height,
                        slider_items: index_show.slider_items,
                        nav_is_show: index_show.nav_is_show,
                        nav_style: index_show.nav_style,
                        nav_items: index_show.nav_items,
                        notice_is_show: index_show.notice_is_show,
                        notice_icon: index_show.notice_icon,
                        notice_content: index_show.notice_content,
                        category_is_show: index_show.category_is_show,
                        category_items: index_show.category_items
                    })
                }
            }
        }
    });
    console.log(that.data)
    // var uniacid = app.siteInfo.uniacid;
    //that.setTabBar()
    // app.util.request({
    //   url: 'entry/wxapp/index',  
    //   data: {
    //     m: 'yyf_company',
    //     uniacid: uniacid
    //   },
    //   cachetime: 0,
    //   success: function (res) {
    //     if (!res.data.errno) {
    //       that.setData({
    //         slide: res.data.data.slide,
    //         sysinfo: res.data.data.sysinfo,
    //         list:res.data.data.list,
    //         cats: res.data.data.cats,
    //         horn:res.data.data.horn,
    //         notice_close: res.data.data.notice_close,
    //         slide_close: res.data.data.slide_close,
    //         nav_close: res.data.data.nav_close,
    //         slide_height: res.data.data.slide_height,
    //         nav_style: res.data.data.nav_style,
    //         title_style: res.data.data.title_style
    //       })
    //       wx.setNavigationBarTitle({
    //         title: res.data.data.sysinfo.title,
    //       })
    //       app.globalData.copyright = res.data.data.sysinfo.copyright;
          
    //     }
    //   },
    //   fail: function (res) {
    //     failGo(res.message);
    //   }
    // });

    // app.util.request({
    //   url: 'entry/wxapp/Adsense',
    //   data: {
    //     m: 'yyf_company',
    //     uniacid: uniacid
    //   },
    //   cachetime: 0,
    //   success: function (res) {
    //     if (!res.data.errno) {
    //       that.setData({
    //         adsense: res.data.data,
           
    //       })
    //     }
    //   }
    // });
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.sysinfo.name,
      path: '/yyf_company/pages/index/index'
    }
  },

  setTabBar: function (){
    var blist = wx.getStorageSync('barlist');
    blist = {
        tcolor: '#1ba358',  // 主题色
        background_color: '#1ba358', // 导航 背景色
        border_color: '#ccc', // 导航顶部边框颜色
        m1_name: '首页',
        m1_path: 'tel',
        m1_img: 'http://cdn.w7.cc/images/2018/02/01/15174482535a726c3e190e4_TTuuBwj82J2U.png?imageView2/5/w/83/format/png',
        m1_selimg: 'http://cdn.w7.cc/images/2018/02/01/15174482535a726c3e190e4_TTuuBwj82J2U.png?imageView2/5/w/83/format/png',
    }
    var that=this;
    if(!blist){
      setTimeout(function () {
        that.setTabBar()
      }, 200)
    }
    this.setData({
      blist: blist,
      tcolor: blist.tcolor
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: blist.tcolor,
    })
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    var url = currentPage.route
    var blist = this.data.blist;
    var pageArr = url.split('/');
    if (pageArr[pageArr.length - 1] == 'index') {
      blist['isCurrentPage']=true;
    }
    var barArr = new Array(blist.m1_path, blist.m2_path, blist.m3_path, blist.m4_path);
    var currentNum=0;
    for (var x in barArr) {
      if (barArr[x] == 'index') {
        currentNum = parseInt(x) + 1;
      }
    }
    blist['currentNum'] = currentNum;
    this.setData({
      blist:blist
    })
  },
  tel: function () {
    var phone=this.data.blist.phone
    wx.makePhoneCall({
      phoneNumber: phone, 
    })
  },
  driver: function(){
    wx.openLocation({
      latitude: Number(this.data.blist.jing),
      longitude: Number(this.data.blist.wei),
      address: this.data.blist.address
    })  
  },
  navigateMini: function (event){
    
    var sid = event.currentTarget.dataset.sid;
    var fid = event.currentTarget.dataset.fid;
    var appid=this.data.list[fid].list[sid].appid;
    var pageaddress = this.data.list[fid].list[sid].pageaddress;
    wx.navigateToMiniProgram({
      appId: appid,
      path: pageaddress,
      success(res) {
        console.log('11');
      }
    })
  }


  
})