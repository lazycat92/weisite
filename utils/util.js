var appInfo = null;
var userInfo = null;
var sk = null;

// 初始化
function init(that) {
    if (wx.getExtConfig) {
        wx.getExtConfig({
            success: function (res) {
                appInfo = res.extConfig
                if (that && that.globalData) {
                    that.globalData.appInfo = res.extConfig;
                }
                // 获取配置信息
                // req('getAddonSettings', 'get', {}, function (res) {
                //     if (res.errcode == 0) {
                //         that.globalData.addonSettings = res.items;
                //     }
                // })
            }
        })
    } 
}

// 登录检测
function checkLogin(that) {
    if (that.globalData.appInfo) {
        wx.checkSession({
            success: function () {
                wx.getStorage({
                    key: 'sk',
                    success: function (res) {
                        var sk = res.data;
                        req('checkLogin', 'post', {}, function (data) {
                            if (data.errcode == 0) {
                                that.globalData.sk = sk;
                                wx.getStorage({
                                    key: 'userInfo',
                                    success: function (ret) {
                                        if (ret.data) {
                                            that.globalData.userInfo = ret.data;
                                        } else {
                                            login(that);
                                            return;
                                        }
                                    },
                                    fail: function () {
                                        login(that);
                                        return;
                                    }
                                });
                            } else {
                                login(that);
                                return;
                            }
                        })
                    },
                    fail: function () {
                        login(that);
                        return;
                    }
                })
            },
            fail: function () {
                //登录态过期
                login(that) //重新登录
            }
        })
    }
}

// 微信登录
function login(that) {
    wx.login({
        success: function (res) {
            wx.getUserInfo({
                success: function (userinfo) {
                    req('userLogin', 'post', {
                        "code": res.code,
                        "encryptedData": userinfo.encryptedData,
                        "iv": userinfo.iv
                    }, 0, function (data) {
                        if (data.errcode == 0) {
                            userInfo = that.globalData.userInfo = data.items.user;
                            wx.setStorage({
                                key: "userInfo",
                                data: data.items.user
                            })
                            sk = that.globalData.sk = data.items.sk;
                            wx.setStorage({
                                key: "sk",
                                data: data.items.sk
                            })
                        } else {
                            loginFail();
                        }
                    })
                },
                fail: function (res) {
                    loginFail();
                }
            })
        }
    })
} 

// 登录失败
function loginFail() {
    wx.showModal({
        content: '登录失败，请允许获取用户信息,如不显示请删除小程序重新进入',
        showCancel: false
    });
}

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function req(api, method, data, cb) {
    var timer = setInterval(function(){
        if (appInfo) {
            clearInterval(timer);
            var url = appInfo.domain + '/addon/' + appInfo.addon + '/api/' + api + '/mpid/' + appInfo.mpid;
            var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
            header['Session-Key'] = sk;
            header['Addon-Theme'] = appInfo.theme;
            header['Addon-Version'] = appInfo.version;
            wx.request({
                url: url,
                data: data,
                method: method,
                header: header,
                success: function (res) {
                    return typeof cb == "function" && cb(res.data)
                },
                fail: function () {
                    return typeof cb == "function" && cb(false)
                }
            });
        }
        init();
    }, 1000);
}

function uploadPic(data, cb) {
    if (!appInfo) {
        return;
    }
    var url = appInfo.domain + '/addon/' + appInfo.addon + '/api/uploadPicture/mpid/' + appInfo.mpid;
    var header = {};
    header['Session-Key'] = sk;
    header['Addon-Theme'] = appInfo.theme;
    header['Addon-Version'] = appInfo.version;
    wx.chooseImage({
        count: 1,
        success: function (res) {
            var tempFilePaths = res.tempFilePaths
            wx.uploadFile({
                url: url,
                filePath: tempFilePaths[0],
                name: 'file',
                formData: data,
                header: header,
                success: function (res) {
                    return typeof cb == "function" && cb(res.data)
                },
                fail: function () {
                    return typeof cb == "function" && cb(false)
                }
            })
        }
    })
}

// 去前后空格  
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息  
function isError(msg, that) {
    that.setData({
        showTopTips: true,
        errorMsg: msg
    })
}

// 清空错误信息  
function clearError(that) {
    that.setData({
        showTopTips: false,
        errorMsg: ""
    })
}

function getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = dateTimeStamp - now;
    if (diffValue < 0) { return; }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    var result = '';
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月后";
    }
    else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周后";
    }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天后";
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时后";
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟后";
    } else
        result = "刚刚";
    return result;
}

function getDateBiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) { return; }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    var result = '';
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    }
    else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}

function escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}

module.exports = {
    init: init,
    checkLogin: checkLogin,
    formatTime: formatTime,
    req: req,
    uploadPic: uploadPic,
    trim: trim,
    isError: isError,
    clearError: clearError,
    getDateDiff: getDateDiff,
    escape2Html: escape2Html,
    getDateBiff: getDateBiff,
    login: login
}  