import Md5 from "./md5"
let ZLZZ_SDK_Openid = ""//用户唯一指
var mpshow_time = null,
  query_share_depth = 0,
  share_distinct_id = "",
  share_method = "",
  current_scene = "",
  is_first_launch = !1;
var ArrayProto = Array.prototype,
  FuncProto = Function.prototype,
  ObjProto = Object.prototype,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  LIB_VERSION = '1.13.24',
  LIB_NAME = 'MiniProgram';
var _ = {};

var zjzzObj = {};

zjzzObj.Component = function (option) {
  try {
    var methods = zjzzObj.para.autoTrack && zjzzObj.para.autoTrack.mpClick && _.getMethods(option.methods);

    if (!!methods) {
      for (var i = 0, len = methods.length; i < len; i++) {
        click_proxy(option.methods, methods[i]);
      }
    }

    mp_proxy(option.methods, 'onLoad', 'pageLoad');
    mp_proxy(option.methods, 'onShow', 'pageShow');
    if (typeof option.methods.onShareAppMessage === 'function') {
      zjzzObj.autoTrackCustom.pageShare(option.methods);
    }
    Component.apply(this, arguments);
  } catch (e) {
    Component.apply(this, arguments);
  }
}
zjzzObj.quick = function () {
 
  var arg0 = arguments[0];
  var arg1 = arguments[1];
  var arg2 = arguments[2];

  var prop = _.isObject(arg2) ? arg2 : {};
  if (arg0 === 'getAnonymousID') {
    if (_.isEmptyObject(zjzzObj.store._state)) {
      logger.info('请先初始化SDK');
     
    } else {
      return zjzzObj.store._state._first_id || zjzzObj.store._state.first_id || zjzzObj.store._state._distinct_id || zjzzObj.store._state.distinct_id;
    }
  } else if (arg0 === 'appLaunch' || arg0 === 'appShow') {
    if (arg1) {
      zjzzObj.autoTrackCustom[arg0](arg1, prop);
    } else {
      logger.info('App的launch和show，在sensors.quick第二个参数必须传入App的options参数');
    }
  } else if (arg0 === 'appHide') {
    prop = _.isObject(arg1) ? arg1 : {};
    zjzzObj.autoTrackCustom[arg0](prop);
  }
};

var computerTime = function (str) {

  let restime = new Date().getFullYear() + '-' +
    (new Date().getMonth() + 1) + '-' +
    (new Date().getDate() + 1) + ' ' +
    "00" + ':' +
    "00" + ':' +
    "00"


  if (Date.parse(new Date(restime)) - Date.parse(new Date(str)) < 24 * 3600 * 1000) {
    //24小时
    return true
  } else {
    return false
  }

}
//自定义事件
var customEvents = function (obj) {

  var propevent = {};
  var pagesappHideevent = ""
  //setTimeout(() => {

  propevent.$url_path = _.getCurrentPath();
  if (mpshow_time && ((new Date()).getTime() - mpshow_time > 0) && (((new Date()).getTime() - mpshow_time) / 3600000 < 24)) {
    propevent.event_duration = ((new Date()).getTime() - mpshow_time) / 1000;
  }
  pagesappHideevent = getCurrentPages();
  propevent = _.extend(propevent, true);


  // }, 1000);

  console.log('进入自定义事件', propevent, pagesappHideevent, "----");
  const currentTimempEnd =
    new Date().getFullYear() + '-' +
    (new Date().getMonth() + 1) + '-' +
    new Date().getDate() + ' ' +
    new Date().getHours() + ':' +
    (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
    (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
  resobj.properties.push({
    event: obj.event,
    event_time: currentTimempEnd,
    title: "",
    url_path: propevent.$url_path,
    url_params: pagesappHideevent.length ? ObjToString(pagesappHideevent[pagesappHideevent.length - 1].options) : "",
    last_path: pagesappHideevent.length > 1 ?
      pagesappHideevent[pagesappHideevent.length - 2].route :
      "",
    last_params: (pagesappHideevent.length && pagesappHideevent.length > 1) ?
      ObjToString(pagesappHideevent[pagesappHideevent.length - 2].options) :
      "",
    duration: propevent.event_duration * 1000,
    is_first_day: computerTime(wx.getStorageSync('ZLZZ_SDK_Option_Data').triggerTime),//是否首天触发的事件	
    is_first_time: wx.getStorageSync('ZLZZ_SDK_Option_Data').is_first_time	,//是否首次触发的事件	,//是否首次触发的事件	
    is_login: wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id ? true : false,//是否为登录状态	
    depth: pagesappHideevent.length//当前页面的层级	
  })
  wx.setStorageSync('ZLZZ_Res_Data_Properties', resobj.properties)
  console.log("appHide resobj", resobj);

}

zjzzObj.autoTrackCustom = {
  trackCustom: function (e, t, a) {
    var r = zjzzObj.para.autoTrack[e],
      s = "";
    zjzzObj.para.autoTrack && r && ("function" == typeof r ? (s = r(), _.isObject(s) && _.extend(t, s)) : _.isObject(r) && (_.extend(t, r), zjzzObj.para.autoTrack[e] = !0), zjzzObj.track(a, t))
  },
  appLaunch: function (e) {

    console.log("进MPLaunch");
    var getZLZZ_SDK_Option_Data = wx.getStorageSync('ZLZZ_SDK_Option_Data') || []
    // if (getZLZZ_SDK_Option_Data) {
    //   if (!getZLZZ_SDK_Option_Data.todayTime) {

    //     //今日未登陆
    //     getZLZZ_SDK_Option_Data.todayTime =
    //       new Date().getFullYear() + '-' +
    //       (new Date().getMonth() + 1) + '-' +
    //       new Date().getDate() + ' ' +
    //       new Date().getHours() + ':' +
    //       (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
    //       (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
    //     wx.setStorageSync('ZLZZ_SDK_Option_Data', getZLZZ_SDK_Option_Data)
    //   }
    // }

    //if (!getZLZZ_SDK_Option_Data || !getZLZZ_SDK_Option_Data.openId) {
      //登陆
       getlogin()//获取用户唯一标识
   // }


    if (typeof this === 'object' && !this['trackCustom']) {
      this[zjzzObj.para.name] = zjzzObj;
    }

    var prop = {};
    if (e && e.path) {
      prop.$url_path = _.getPath(e.path);
    }
    _.setShareInfo(e, prop);
    var utms = _.setUtm(e, prop);
    if (is_first_launch) {
      prop.$is_first_time = true;
      if (!_.isEmptyObject(utms.pre1)) {
        zjzzObj.setOnceProfile(utms.pre1);
      }
    } else {
      prop.$is_first_time = false;
    }

    _.setLatestChannel(utms.pre2);

    prop.$scene = _.getMPScene(e.scene);
    zjzzObj.registerApp({
      $latest_scene: prop.$scene
    });

    prop.$url_query = _.setQuery(e.query);


    prop = _.extend(prop, true);


    zjzzObj.track('$MPLaunch', prop);

    //

    console.log('初始化', this.globalData);
    //小程序初始化完成时触发或者小程序进入后台一定时间后被微信杀死进程后再次启动小程序时触发
    console.log('进入appLaunch', e, this.globalData.userInfo);
    //获取系统当前时间
    const currentTimeappLaunch =
      new Date().getFullYear() + '-' +
      (new Date().getMonth() + 1) + '-' +
      new Date().getDate() + ' ' +
      new Date().getHours() + ':' +
      (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
      (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
    resobj.properties.push({
      event: "mpLaunch",
      event_time: currentTimeappLaunch,
      title: "",
      url_path: e.path,
      url_params: ObjToString(e.query),
      last_path: "",
      last_params: "",
      is_first_day: computerTime(wx.getStorageSync('ZLZZ_SDK_Option_Data').triggerTime),//是否首天触发的事件	
      is_first_time: wx.getStorageSync('ZLZZ_SDK_Option_Data').is_first_time,//是否首次触发的事件	
      is_login: wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id ? true : false,//是否为登录状态	
      depth: 1//当前页面的层级	
    })
    wx.setStorageSync('ZLZZ_Res_Data_Properties', resobj.properties)
    console.log("pageLoad resobj", resobj);
  },
  appShow: function (e) {
    //小程序启动时触发或者从后台切换到前台时触发，包括首次启动
    countDown()//开启倒计时
    var getZLZZ_SDK_Option_DataappShow = wx.getStorageSync('ZLZZ_SDK_Option_Data') || []
    // if (!getZLZZ_SDK_Option_DataappShow.todayTime) {

    //   //今日未登陆
    //   getZLZZ_SDK_Option_DataappShow.todayTime =
    //     new Date().getFullYear() + '-' +
    //     (new Date().getMonth() + 1) + '-' +
    //     new Date().getDate() + ' ' +
    //     new Date().getHours() + ':' +
    //     (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
    //     (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
    //   wx.setStorageSync('ZLZZ_SDK_Option_Data', getZLZZ_SDK_Option_DataappShow)
    // }


    var oldPage = Page;
    Page = function (option) {

      mp_proxy(option, "onLoad", 'pageLoad');
      mp_proxy(option, "onShow", 'pageShow');
      oldPage.apply(this, arguments);
    };


    var prop = {};

    mpshow_time = (new Date()).getTime();

    if (e && e.path) {
      prop.$url_path = _.getPath(e.path);
    }

    _.setShareInfo(e, prop);

    var utms = _.setUtm(e, prop);

    _.setLatestChannel(utms.pre2);

    prop.$scene = _.getMPScene(e.scene);
    zjzzObj.registerApp({
      $latest_scene: prop.$scene
    });

    prop.$url_query = _.setQuery(e.query);
    prop = _.extend(prop, true);
    zjzzObj.track('$MPShow', prop);
    // zjzzObj.autoTrackCustom.trackCustom('appShow', prop, '$MPShow');
    console.log('进入appShow', prop, e);
    const currentTimempStart =
      new Date().getFullYear() + '-' +
      (new Date().getMonth() + 1) + '-' +
      new Date().getDate() + ' ' +
      new Date().getHours() + ':' +
      (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
      (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
    resobj.properties.push({
      event: "mpStart",
      event_time: currentTimempStart,
      title: "",
      url_path: prop.$url_path,
      url_params: prop.$url_query,
      last_path: "",
      last_params: "",
      is_first_day: computerTime(wx.getStorageSync('ZLZZ_SDK_Option_Data').triggerTime),//是否首天触发的事件	
      is_first_time: wx.getStorageSync('ZLZZ_SDK_Option_Data').is_first_time,//是否首次触发的事件	
      is_login: wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id ? true : false,//是否为登录状态	
      depth: 1//当前页面的层级	
    })
    wx.setStorageSync('ZLZZ_Res_Data_Properties', resobj.properties)
    console.log("appShow resobj", resobj);
  },
  appHide: function () {

    clearInterval(countDowntimer);//关闭倒计时

    var current_time = (new Date()).getTime();
    var prop = {};
    prop.$url_path = _.getCurrentPath();
    if (mpshow_time && (current_time - mpshow_time > 0) && ((current_time - mpshow_time) / 3600000 < 24)) {
      prop.event_duration = (current_time - mpshow_time) / 1000;
    }
    var pagesappHide = getCurrentPages();
    prop = _.extend(prop, true);
    zjzzObj.track('$MPHide', prop);

    zjzzObj.sendStrategy.onAppHide();
    console.log('进入appHide', prop, pagesappHide);
    const currentTimempEnd =
      new Date().getFullYear() + '-' +
      (new Date().getMonth() + 1) + '-' +
      new Date().getDate() + ' ' +
      new Date().getHours() + ':' +
      (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
      (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
    resobj.properties.push({
      event: "mpEnd",
      event_time: currentTimempEnd,
      title: "",
      url_path: prop.$url_path,
      url_params: ObjToString(pagesappHide[pagesappHide.length - 1].options),
      last_path: pagesappHide.length > 1 ?
        pagesappHide[pagesappHide.length - 2].route :
        "",
      last_params: pagesappHide.length > 1 ?
        ObjToString(pagesappHide[pagesappHide.length - 2].options) :
        "",
      duration: prop.event_duration * 1000,
      is_first_day: computerTime(wx.getStorageSync('ZLZZ_SDK_Option_Data').triggerTime),//是否首天触发的事件	
      is_first_time: wx.getStorageSync('ZLZZ_SDK_Option_Data').is_first_time,//是否首次触发的事件	
      is_login: wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id ? true : false,//是否为登录状态	
      depth: pagesappHide.length//当前页面的层级	
    })
    wx.setStorageSync('ZLZZ_Res_Data_Properties', resobj.properties)
    console.log("appHide resobj", resobj);
  },
  pageLoad: function (e) {
    //console.log('进入pageLoad',e);

  },
  pageShow: function () {
    var current_timeshow = (new Date()).getTime();
    var propshow = {};
    propshow.$url_path = _.getCurrentPath();
    if (mpshow_time && (current_timeshow - mpshow_time > 0) && ((current_timeshow - mpshow_time) / 3600000 < 24)) {
      propshow.event_duration = (current_timeshow - mpshow_time) / 1000;
    }
    const currentTimempView =
      new Date().getFullYear() + '-' +
      (new Date().getMonth() + 1) + '-' +
      new Date().getDate() + ' ' +
      new Date().getHours() + ':' +
      (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
      (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
    var pageShowpages = getCurrentPages();
    console.log('进入pageShow', pageShowpages);
    resobj.properties.push({
      event: "mpView",
      event_time: currentTimempView,
      title: "",
      url_path: pageShowpages[pageShowpages.length - 1].route,
      url_params: ObjToString(pageShowpages[pageShowpages.length - 1].options),
      last_path: pageShowpages.length > 1 ?
        pageShowpages[pageShowpages.length - 2].route :
        "",
      last_params: pageShowpages.length > 1 ?
        ObjToString(pageShowpages[pageShowpages.length - 2].options) :
        "",
      duration: propshow.event_duration * 1000,
      is_first_day: computerTime(wx.getStorageSync('ZLZZ_SDK_Option_Data').triggerTime),//是否首天触发的事件	
      is_first_time: wx.getStorageSync('ZLZZ_SDK_Option_Data').is_first_time,//是否首次触发的事件	
      is_login: wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id ? true : false,//是否为登录状态	
      depth: pageShowpages.length//当前页面的层级
    })
    wx.setStorageSync('ZLZZ_Res_Data_Properties', resobj.properties)
    console.log("pageShow resobj", resobj);
  },
  pageShare: function (e) {
    console.log('进入pageShare', e);
    var oldMessage = e.onShareAppMessage;

    e.onShareAppMessage = function () {

      var oldValue = oldMessage.apply(this, arguments);

      if (zjzzObj.para.autoTrack && zjzzObj.para.autoTrack.pageShare) {
        zjzzObj.autoTrackCustom.trackCustom('pageShare', {
          $url_path: _.getCurrentPath(),
          $share_depth: query_share_depth
        }, '$MPShare');
      }

      if (zjzzObj.para.allow_amend_share_path) {
        if (typeof oldValue !== 'object') {
          oldValue = {};
          oldValue.path = _.getCurrentUrl(this);
        }
        if (typeof oldValue === 'object' && (typeof oldValue.path === 'undefined' || oldValue.path === '')) {
          oldValue.path = _.getCurrentUrl(this);
        }
        if (typeof oldValue === 'object' && typeof oldValue.path === 'string') {
          if (oldValue.path.indexOf('?') === -1) {
            oldValue.path = oldValue.path + '?';
          } else {
            if (oldValue.path.slice(-1) !== '&') {
              oldValue.path = oldValue.path + '&';
            }
          }
        }

        oldValue.path = oldValue.path + 'sampshare=' + encodeURIComponent(_.getShareInfo());
      }
      return oldValue;
    }
  },
  pageShareTimeline: function (e) {
    var t = e.onShareTimeline;
    e.onShareTimeline = function () {
      share_method = "\u670b\u53cb\u5708\u5206\u4eab";
      var e = t.apply(this, arguments);
      return zjzzObj.para.autoTrack && sa.para.autoTrack.pageShare && zjzzObj.autoTrackCustom.trackCustom("pageShare", {
        $url_path: _.getCurrentPath(),
        $share_depth: query_share_depth,
        $share_method: share_method
      }, "$MPShare"), zjzzObj.para.allow_amend_share_path && ("object" != typeof e && (e = {}), "object" == typeof e && void 0 === e.query && (e.query = ""), "object" == typeof e && "string" == typeof e.query && "" !== e.query && "&" !== e.query.slice(-1) && (e.query = e.query + "&"), e.query = e.query + "sampshare=" + encodeURIComponent(_.getShareInfo())), e
    }
  },
}
zjzzObj.sendStrategy = {
  dataHasSend: true,
  dataHasChange: false,
  syncStorage: false,
  failTime: 0,
  onAppHide: function () {
    if (zjzzObj.para.batch_send) {
      this.batchSend();
    }
  },
  send: function (data) {
    if (!zjzzObj.para.server_url) {
      return false;
    }
    if (zjzzObj.para.batch_send) {
      this.dataHasChange = true;
      if (zjzzObj.store.mem.getLength() >= 300) {
        logger.info('数据量存储过大，有异常');
        return false;
      }
      zjzzObj.store.mem.add(data);
      if (zjzzObj.store.mem.getLength() >= zjzzObj.para.batch_send.max_length) {
        this.batchSend();
      }
    } else {
      this.queueSend(data);
    }
  },
  queueSend: function (url) {
    url = JSON.stringify(url);
    if (zjzzObj.para.server_url.indexOf('?') !== -1) {
      url = zjzzObj.para.server_url + '&data=' + encodeURIComponent(_.base64Encode(url));
    } else {
      url = zjzzObj.para.server_url + '?data=' + encodeURIComponent(_.base64Encode(url));
    }

    var instance = new zjzzObj.requestQueue({
      url: url
    });
    instance.close = function () {
      zjzzObj.dataQueue.close();
    };
    zjzzObj.dataQueue.enqueue(instance);
  },
  wxrequest: function (option) {
    if (_.isArray(option.data) && option.data.length > 0) {
      var now = Date.now();
      option.data.forEach(function (v) {
        v._flush_time = now;
      });
      option.data = JSON.stringify(option.data);
      _.wxrequest({
        url: zjzzObj.para.server_url,
        method: 'POST',
        dataType: 'text',
        data: 'data_list=' + encodeURIComponent(_.base64Encode(option.data)),
        success: function () {
          option.success(option.len);
        },
        fail: function () {
          option.fail();
        }
      });
    } else {
      option.success(option.len);
    }
  },
  batchSend: function () {
    if (this.dataHasSend) {
      var data = zjzzObj.store.mem.mdata;
      var len = data.length;
      if (len > 0) {
        this.dataHasSend = false;
        this.wxrequest({
          data: data,
          len: len,
          success: this.batchRemove.bind(this),
          fail: this.sendFail.bind(this)
        });
      }
    }
  },
  sendFail: function () {
    this.dataHasSend = true;
    this.failTime++;
  },
  batchRemove: function (len) {
    zjzzObj.store.mem.clear(len);
    this.dataHasSend = true;
    this.dataHasChange = true;
    this.batchWrite();
    this.failTime = 0;
  },
  is_first_batch_write: true,
  batchWrite: function () {
    var me = this;
    if (this.dataHasChange) {
      if (this.is_first_batch_write) {
        this.is_first_batch_write = false;
        setTimeout(function () {
          me.batchSend();
        }, 1000);
      }

      this.dataHasChange = false;
      if (this.syncStorage) {
        zjzzObj._.setStorageSync('sensors_mp_prepare_data', zjzzObj.store.mem.mdata);
      }
    }
  },
  batchInterval: function () {

    var _this = this;

    function loopWrite() {
      setTimeout(function () {
        _this.batchWrite();
        loopWrite();
      }, 500);
    }

    function loopSend() {
      setTimeout(function () {
        _this.batchSend();
        loopSend();
      }, zjzzObj.para.batch_send.send_timeout * Math.pow(2, _this.failTime));
    }
    loopWrite();
    loopSend();
  }
};
zjzzObj.store = {
  verifyDistinctId: function (e) {
    return "number" == typeof e && (e = String(e), /^\d+$/.test(e) || (e = "unexpected_id")), "string" == typeof e && "" !== e || (e = "unexpected_id"), e
  },
  storageInfo: null,
  getUUID: function () {
    return Date.now() + "-" + Math.floor(1e7 * Math.random()) + "-" + Math.random().toString(16).replace(".", "") + "-" + String(31242 * Math.random()).replace(".", "").slice(0, 8)
  },
  getStorage: function () {
    if (this.storageInfo) {
      return this.storageInfo;
    } else {
      // this.storageInfo = zjzzObj._.getStorageSync("sensorsdata2015_wechat") || '';
      return this.storageInfo;
    }
  },
  _state: {},
  mem: {
    mdata: [],
    getLength: function () {
      return this.mdata.length
    },
    add: function (e) {
      this.mdata.push(e)
    },
    clear: function (e) {
      this.mdata.splice(0, e)
    }
  },
  toState: function (e) {
    var t = null;
    _.isJSONString(e) ? (t = JSON.parse(e)).distinct_id ? this._state = t : this.set("distinct_id", this.getUUID()) : _.isObject(e) && (t = e).distinct_id ? this._state = t : this.set("distinct_id", this.getUUID())
  },
  getFirstId: function () {
    return this._state._first_id || this._state.first_id
  },
  getDistinctId: function () {
    return this._state._distinct_id || this._state.distinct_id
  },
  getUnionId: function () {
    var e = {},
      t = this._state._first_id || this._state.first_id,
      a = this._state._distinct_id || this._state.distinct_id;
    return t && a ? (e.login_id = a, e.anonymous_id = t) : e.anonymous_id = a, e
  },
  getProps: function () {
    return this._state.props || {}
  },
  setProps: function (e, t) {
    var a = this._state.props || {};
    t ? this.set("props", e) : (_.extend(a, e), this.set("props", a))
  },
  set: function (e, t) {
    var a = {};
    for (var r in "string" == typeof e ? a[e] = t : "object" == typeof e && (a = e), this._state = this._state || {}, a) this._state[r] = a[r], "first_id" === r ? delete this._state._first_id : "distinct_id" === r && (delete this._state._distinct_id, zjzzObj.events.emit("changeDistinctId"));
    this.save()
  },
  change: function (e, t) {
    this._state["_" + e] = t
  },
  save: function () {
    var copyState = JSON.parse(JSON.stringify(this._state));
    delete copyState._first_id;
    delete copyState._distinct_id;
    // zjzzObj._.setStorageSync("sensorsdata2015_wechat", copyState);
  }
}
zjzzObj.para = {
  name: 'sensors',
  server_url: '',
  send_timeout: 1000,
  use_client_time: false,
  show_log: true,
  allow_amend_share_path: true,
  max_string_length: 300,
  datasend_timeout: 3000,
  source_channel: [],
  autoTrack: {
    appLaunch: true,
    appShow: true,
    appHide: true,
    pageShow: true,
    pageShare: true,
    mpClick: false,
  },
  is_persistent_save: {
    share: false,
    utm: false
  }
};
zjzzObj.Page = function (option) {
  var methods = zjzzObj.para.autoTrack && zjzzObj.para.autoTrack.mpClick && _.getMethods(option);

  if (!!methods) {
    for (var i = 0, len = methods.length; i < len; i++) {
      click_proxy(option, methods[i]);
    }
  }
  mp_proxy(option, "onLoad", 'pageLoad');
  mp_proxy(option, "onShow", 'pageShow');
  if (typeof option.onShareAppMessage === 'function') {
    zjzzObj.autoTrackCustom.pageShare(option);
  }
  Page.apply(this, arguments);
};
var mp_scene = {
  1000: '其他',
  1001: '发现栏小程序主入口，「最近使用」列表（基础库2.2.4版本起包含「我的小程序」列表）',
  1005: '顶部搜索框的搜索结果页',
  1006: '发现栏小程序主入口搜索框的搜索结果页',
  1007: '单人聊天会话中的小程序消息卡片',
  1008: '群聊会话中的小程序消息卡片',
  1010: '收藏夹',
  1011: '扫描二维码',
  1012: '长按图片识别二维码',
  1013: '手机相册选取二维码',
  1014: '小程序模版消息',
  1017: '前往体验版的入口页',
  1019: '微信钱包',
  1020: '公众号 profile 页相关小程序列表',
  1022: '聊天顶部置顶小程序入口',
  1023: '安卓系统桌面图标',
  1024: '小程序 profile 页',
  1025: '扫描一维码',
  1026: '附近小程序列表',
  1027: '顶部搜索框搜索结果页“使用过的小程序”列表',
  1028: '我的卡包',
  1029: '卡券详情页',
  1030: '自动化测试下打开小程序',
  1031: '长按图片识别一维码',
  1032: '手机相册选取一维码',
  1034: '微信支付完成页',
  1035: '公众号自定义菜单',
  1036: 'App 分享消息卡片',
  1037: '小程序打开小程序',
  1038: '从另一个小程序返回',
  1039: '摇电视',
  1042: '添加好友搜索框的搜索结果页',
  1043: '公众号模板消息',
  1044: '带 shareTicket 的小程序消息卡片（详情)',
  1045: '朋友圈广告',
  1046: '朋友圈广告详情页',
  1047: '扫描小程序码',
  1048: '长按图片识别小程序码',
  1049: '手机相册选取小程序码',
  1052: '卡券的适用门店列表',
  1053: '搜一搜的结果页',
  1054: '顶部搜索框小程序快捷入口',
  1056: '音乐播放器菜单',
  1057: '钱包中的银行卡详情页',
  1058: '公众号文章',
  1059: '体验版小程序绑定邀请页',
  1064: '微信连Wi-Fi状态栏',
  1067: '公众号文章广告',
  1068: '附近小程序列表广告',
  1069: '移动应用',
  1071: '钱包中的银行卡列表页',
  1072: '二维码收款页面',
  1073: '客服消息列表下发的小程序消息卡片',
  1074: '公众号会话下发的小程序消息卡片',
  1077: '摇周边',
  1078: '连Wi-Fi成功页',
  1079: '微信游戏中心',
  1081: '客服消息下发的文字链',
  1082: '公众号会话下发的文字链',
  1084: '朋友圈广告原生页',
  1088: '会话中查看系统消息，打开小程序',
  1089: '微信聊天主界面下拉',
  1090: '长按小程序右上角菜单唤出最近使用历史',
  1091: '公众号文章商品卡片',
  1092: '城市服务入口',
  1095: '小程序广告组件',
  1096: '聊天记录',
  1097: '微信支付签约页',
  1099: '页面内嵌插件',
  1102: '公众号 profile 页服务预览',
  1103: '发现栏小程序主入口，“我的小程序”列表',
  1104: '微信聊天主界面下拉，“我的小程序”栏',
  1106: '聊天主界面下拉，从顶部搜索结果页，打开小程序',
  1107: '订阅消息，打开小程序',
  1113: '安卓手机负一屏，打开小程序(三星)',
  1114: '安卓手机侧边栏，打开小程序(三星)',
  1124: '扫“一物一码”打开小程序',
  1125: '长按图片识别“一物一码”',
  1126: '扫描手机相册中选取的“一物一码”',
  1129: '微信爬虫访问',
  1131: '浮窗打开小程序',
  1133: '硬件设备打开小程序',
  1146: '地理位置信息打开出行类小程序',
  1148: '卡包-交通卡，打开小程序',
  1150: '扫一扫商品条码结果页打开小程序',
  1153: '“识物”结果页打开小程序'
};


var source_channel_standard = 'utm_source utm_medium utm_campaign utm_content utm_term';
var latest_source_channel = ['$latest_utm_source', '$latest_utm_medium', '$latest_utm_campaign', '$latest_utm_content', '$latest_utm_term', 'latest_sa_utm'];
var latest_share_info = ['$latest_share_distinct_id', '$latest_share_url_path', '$latest_share_depth'];
(function () {

  var nativeBind = FuncProto.bind,
    nativeForEach = ArrayProto.forEach,
    nativeIndexOf = ArrayProto.indexOf,
    nativeIsArray = Array.isArray,
    breaker = {};

  var each = _.each = function (obj, iterator, context) {
    if (obj == null) {
      return false;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0,
        l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
          return false;
        }
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) {
            return false;
          }
        }
      }
    }
  };

  _.logger = logger;
  _.extend = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (source[prop] !== void 0) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  _.extend2Lev = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (source[prop] !== void 0 && source[prop] !== null) {
          if (_.isObject(source[prop]) && _.isObject(obj[prop])) {
            _.extend(obj[prop], source[prop]);
          } else {
            obj[prop] = source[prop];
          }
        }
      }
    });
    return obj;
  };
  _.coverExtend = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (source[prop] !==
          void 0 && obj[prop] ===
          void 0) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  _.isArray = nativeIsArray ||
    function (obj) {
      return toString.call(obj) === '[object Array]';
    };

  _.isFunction = function (f) {
    try {
      return /^\s*\bfunction\b/.test(f);
    } catch (x) {
      return false;
    }
  };

  _.isArguments = function (obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  _.toArray = function (iterable) {
    if (!iterable) {
      return [];
    }
    if (iterable.toArray) {
      return iterable.toArray();
    }
    if (_.isArray(iterable)) {
      return slice.call(iterable);
    }
    if (_.isArguments(iterable)) {
      return slice.call(iterable);
    }
    return _.values(iterable);
  };
  _.getShareInfo = function () {
    return JSON.stringify({
      i: zjzzObj.store.getDistinctId() || '取值异常',
      p: _.getCurrentPath(),
      d: query_share_depth
    });
  };

  _.values = function (obj) {
    var results = [];
    if (obj == null) {
      return results;
    }
    each(obj, function (value) {
      results[results.length] = value;
    });
    return results;
  };

  _.include = function (obj, target) {
    var found = false;
    if (obj == null) {
      return found;
    }
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return obj.indexOf(target) != -1;
    }
    each(obj, function (value) {
      if (found || (found = (value === target))) {
        return breaker;
      }
    });
    return found;
  };

})();
zjzzObj.prepareData = function (p, callback) {
  console.log("分享前-----前", p);
  var data = {
    distinct_id: this.store.getDistinctId(),
    lib: {
      $lib: LIB_NAME,
      $lib_method: 'code',
      $lib_version: String(LIB_VERSION)
    },
    properties: {}
  };

  _.extend(data, this.store.getUnionId(), p);

  if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)) {
    _.extend(data.properties, p.properties);
  }

  if (!p.type || p.type.slice(0, 7) !== 'profile') {
    if (zjzzObj.para.batch_send) {
      data._track_id = Number(String(Math.random()).slice(2, 5) + String(Math.random()).slice(2, 4) + String(Date.now()).slice(-4));
    }
    data.properties = _.extend({}, _.info.properties, zjzzObj.store.getProps(), _.info.currentProps, data.properties);

    if (typeof zjzzObj.store._state === 'object' && typeof zjzzObj.store._state.first_visit_day_time === 'number' && zjzzObj.store._state.first_visit_day_time > (new Date()).getTime()) {
      data.properties.$is_first_day = true;
    } else {
      data.properties.$is_first_day = false;
    }
  }
  if (data.properties.$time && _.isDate(data.properties.$time)) {
    data.time = data.properties.$time * 1;
    delete data.properties.$time;
  } else {
    if (zjzzObj.para.use_client_time) {
      data.time = (new Date()) * 1;
    }
  }


  _.searchObjDate(data);
  _.searchObjString(data);
  console.log("分享前");
  logger.info(data);

  zjzzObj.sendStrategy.send(data);
};
zjzzObj.registerApp = function (obj) {
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    _.info.currentProps = _.extend(_.info.currentProps, obj);
  }
};
zjzzObj.incrementProfile = function (p, c) {
  if (!_.isObject(p)) {
    return false;
  }
  var str = p;
  if (_.isString(p)) {
    p = {}
    p[str] = 1;
  }
  zjzzObj.prepareData({
    type: 'profile_increment',
    properties: p
  }, c);
};
zjzzObj.track = function (e, p, c) {
  this.prepareData({
    type: 'track',
    event: e,
    properties: p
  }, c);
};
_.getCurrentPath = function () {
  var url = '未取到';
  try {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    url = currentPage.route;
  } catch (e) {
    logger.info(e);
  };
  return url;
};
_.setQuery = function (params, isEncode) {
  var url_query = '';
  if (params && _.isObject(params) && !_.isEmptyObject(params)) {
    var arr = [];
    _.each(params, function (value, key) {
      if (!(key === 'q' && _.isString(value) && value.indexOf('http') === 0) && key !== 'scene') {
        if (isEncode) {
          arr.push(key + '=' + value);
        } else {
          arr.push(key + '=' + _.decodeURIComponent(value));
        }
      }
    });
    return arr.join('&');
  } else {
    return url_query;
  }
};
_.getCurrentUrl = function (me) {
  var path = _.getCurrentPath();
  var query = '';
  if (_.isObject(me) && me.sensors_mp_encode_url_query) {
    query = me.sensors_mp_encode_url_query;
  }
  if (path) {
    return (query ? path + '?' + query : path);
  } else {
    return '未取到';
  }
};

_.getPath = function (path) {
  if (typeof path === 'string') {
    path = path.replace(/^\//, '');
  } else {
    path = '取值异常';
  }
  return path;
};

_.getMethods = function (option) {
  var methods = [];
  for (var m in option) {
    if (typeof (option[m]) === 'function' && !mpHook[m]) {
      methods.push(m);
    }
  }
  return methods;
}

_.isClick = function (type) {
  var mpTaps = {
    "tap": 1,
    "longpress": 1,
    "longtap": 1,
  };
  return !!mpTaps[type];
}
_.setShareInfo = function (para, prop) {
  var share = {};
  var obj = {};
  var current_id = zjzzObj.store.getDistinctId();
  var current_first_id = zjzzObj.store.getFirstId();
  if (para && _.isObject(para.query) && para.query.sampshare) {
    share = _.decodeURIComponent(para.query.sampshare);
    if (_.isJSONString(share)) {
      share = JSON.parse(share);
    } else {
      return {};
    }
  } else {
    return {};
  }
  var depth = share.d;
  var path = share.p;
  var id = share.i;
  if (typeof id === 'string') {
    prop.$share_distinct_id = id;
    share_distinct_id = id;
    obj.$latest_share_distinct_id = id;
  } else {
    prop.$share_distinct_id = '取值异常';
  }


  if (typeof depth === 'number') {
    if (share_distinct_id && (share_distinct_id === current_id || share_distinct_id === current_first_id)) {
      prop.$share_depth = depth;
      query_share_depth = depth;
      obj.$latest_share_depth = depth;
    } else if (share_distinct_id && (share_distinct_id !== current_id || share_distinct_id !== current_first_id)) {
      prop.$share_depth = depth + 1;
      query_share_depth = depth + 1;
      obj.$latest_share_depth = depth + 1;
    } else {
      prop.$share_depth = '-1';
    }
  } else {
    prop.$share_depth = '-1';
  }
  if (typeof path === 'string') {
    prop.$share_url_path = path;
    obj.$latest_share_url_path = path;
  } else {
    prop.$share_url_path = '取值异常';
  }
  _.setLatestShare(obj);
};
_.searchObjString = function (o) {
  if (_.isObject(o)) {
    _.each(o, function (a, b) {
      if (_.isObject(a)) {
        _.searchObjString(o[b]);
      } else {
        if (_.isString(a)) {
          o[b] = _.formatString(a);
        }
      }
    });
  }
};
_.formatString = function (str) {
  if (str.length > zjzzObj.para.max_string_length) {
    logger.info('字符串长度超过限制，已经做截取--' + str);
    return str.slice(0, zjzzObj.para.max_string_length);
  } else {
    return str;
  }
};
_.searchObjDate = function (o) {
  if (_.isObject(o)) {
    _.each(o, function (a, b) {
      if (_.isObject(a)) {
        _.searchObjDate(o[b]);
      } else {
        if (_.isDate(a)) {
          o[b] = _.formatDate(a);
        }
      }
    });
  }
};
_.decodeURIComponent = function (val) {
  var result = '';
  try {
    result = decodeURIComponent(val);
  } catch (e) {
    result = val;
  };
  return result;
};
_.isObject = function (obj) {
  if (obj === undefined || obj === null) {
    return false;
  } else {
    return (toString.call(obj) == '[object Object]');
  }
};

_.isEmptyObject = function (obj) {
  if (_.isObject(obj)) {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
};

_.isUndefined = function (obj) {
  return obj ===
    void 0;
};

_.isString = function (obj) {
  return toString.call(obj) == '[object String]';
};

_.isDate = function (obj) {
  return toString.call(obj) == '[object Date]';
};

_.isBoolean = function (obj) {
  return toString.call(obj) == '[object Boolean]';
};

_.isNumber = function (obj) {
  return (toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj)));
};

_.isJSONString = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
_.setUtm = function (para, prop) {
  var utms = {};
  var query = _.getMixedQuery(para);
  var pre1 = _.getCustomUtmFromQuery(query, '$', '_', '$');
  var pre2 = _.getCustomUtmFromQuery(query, '$latest_', '_latest_', '$latest_');
  utms.pre1 = pre1;
  utms.pre2 = pre2;
  _.extend(prop, pre1);
  return utms;
};
_.getMixedQuery = function (para) {
  var obj = _.detectOptionQuery(para);
  var scene = obj.scene;
  var q = obj.q;
  var query = obj.query;
  for (var i in query) {
    query[i] = _.decodeURIComponent(query[i]);
  }
  if (scene) {
    scene = _.decodeURIComponent(scene);
    if (scene.indexOf("?") !== -1) {
      scene = '?' + scene.replace(/\?/g, '');
    } else {
      scene = '?' + scene;
    }
    _.extend(query, _.getObjFromQuery(scene));
  }

  if (q) {
    _.extend(query, _.getObjFromQuery(_.decodeURIComponent(q)));
  }


  return query;
};

_.setUtm = function (para, prop) {
  var utms = {};
  var query = _.getMixedQuery(para);
  var pre1 = _.getCustomUtmFromQuery(query, '$', '_', '$');
  var pre2 = _.getCustomUtmFromQuery(query, '$latest_', '_latest_', '$latest_');
  utms.pre1 = pre1;
  utms.pre2 = pre2;
  _.extend(prop, pre1);
  return utms;
};

_.wxrequest = function (obj) {
  var rq = wx.request(obj);
  setTimeout(function () {
    if (_.isObject(rq) && _.isFunction(rq.abort)) {
      rq.abort();
    }
  }, zjzzObj.para.datasend_timeout);
};
_.detectOptionQuery = function (para) {
  if (!para || !_.isObject(para.query)) {
    return {};
  }
  var result = {};
  result.query = _.extend({}, para.query);
  if (typeof result.query.scene === 'string' && isBScene(result.query)) {
    result.scene = result.query.scene;
    delete result.query.scene;
  }
  if (para.query.q && para.query.scancode_time && String(para.scene).slice(0, 3) === '101') {
    result.q = String(result.query.q);
    delete result.query.q;
    delete result.query.scancode_time;
  }

  function isBScene(obj) {
    var source = ['utm_source', 'utm_content', 'utm_medium', 'utm_campaign', 'utm_term', 'sa_utm'];
    var source_keyword = source.concat(zjzzObj.para.source_channel);
    var reg = new RegExp('(' + source_keyword.join('|') + ')%3D', 'i');
    var keys = Object.keys(obj);
    if (keys.length === 1 && keys[0] === 'scene' && reg.test(obj.scene)) {
      return true;
    } else {
      return false;
    }
  }

  return result;
};
_.getCustomUtmFromQuery = function (
  query, utm_prefix, source_channel_prefix, sautm_prefix
) {
  if (!_.isObject(query)) {
    return {};
  }
  var result = {};
  if (query['sa_utm']) {
    for (var i in query) {
      if (i === 'sa_utm') {
        result[sautm_prefix + i] = query[i];
        continue;
      }
      if (_.include(zjzzObj.para.source_channel, i)) {
        result[source_channel_prefix + i] = query[i];
      }
    }
  } else {
    for (var i in query) {
      if ((' ' + source_channel_standard + ' ').indexOf(' ' + i + ' ') !== -1) {
        result[utm_prefix + i] = query[i];
        continue;
      }
      if (_.include(zjzzObj.para.source_channel, i)) {
        result[source_channel_prefix + i] = query[i];
      }
    }
  }
  return result;
};
_.setLatestChannel = function (channel) {
  if (!_.isEmptyObject(channel)) {
    if (includeChannel(channel, latest_source_channel)) {
      zjzzObj.clearAppRegister(latest_source_channel);
      zjzzObj.clearAllProps(latest_source_channel);
    }
    zjzzObj.para.is_persistent_save.utm ? zjzzObj.register(channel) : zjzzObj.registerApp(channel);
  }

  function includeChannel(channel, arr) {
    var found = false;
    for (var i in arr) {
      if (channel[arr[i]]) {
        found = true;
      }
    }
    return found;
  }
};
_.getMPScene = function (key) {
  if (typeof key === "number" || (typeof key === "string" && key !== "")) {
    key = String(key);
    return mp_scene[key] || key;
  } else {
    return "未取到值";
  }
};
_.info = {
  currentProps: {},
  properties: {
    $lib: LIB_NAME,
    $lib_version: String(LIB_VERSION)
  },
  getSystem: function () {
    var e = this.properties;
    var that = this;

    function getNetwork() {
      wx.getNetworkType({
        "success": function (t) {
          e.$network_type = t["networkType"]
        },
        "complete": getSystemInfo
      })
    }

    function formatSystem(system) {
      var _system = system.toLowerCase();
      if (_system === 'ios') {
        return 'iOS';
      } else if (_system === 'android') {
        return 'Android';
      } else {
        return system;
      }
    }

    function getSystemInfo() {
      wx.getSystemInfo({
        "success": function (t) {
          e.$manufacturer = t["brand"];
          e.$model = t["model"];
          e.$screen_width = Number(t["screenWidth"]);
          e.$screen_height = Number(t["screenHeight"]);
          e.$os = formatSystem(t["platform"]);
          e.$os_version = t["system"].indexOf(' ') > -1 ? t["system"].split(' ')[1] : t["system"];
        },
        "complete": function () {
          var timeZoneOffset = new Date().getTimezoneOffset();
          var appId = _.getAppId();
          if (_.isNumber(timeZoneOffset)) {
            e.$timezone_offset = timeZoneOffset;
          }
          if (appId) {
            e.$app_id = appId;
          }
          zjzzObj.initialState.systemIsComplete = true;
          zjzzObj.initialState.checkIsComplete();
        }
      })
    }

    getNetwork();
  }
};
function getDistinctId() {
  return this._state._distinct_id || this._state.distinct_id
}
let logger = "object" == typeof logger ? logger : {};

logger.info = function () {
  if (zjzzObj.para.show_log && "object" == typeof console && console.log) try {
    console.log("arguments[0]__share", arguments)
    if (arguments && arguments[0] && arguments[0].event == "$MPShare") {
      console.log("调分享方法啦")
      var current_timepageShare = (new Date()).getTime();
      var propshowcurrent_timepageShare = {};
      propshowcurrent_timepageShare.$url_path = _.getCurrentPath();
      if (mpshow_time && (current_timepageShare - mpshow_time > 0) && ((current_timepageShare - mpshow_time) / 3600000 < 24)) {
        propshowcurrent_timepageShare.event_duration = (current_timepageShare - mpshow_time) / 1000;
      }
      const currentTimeShare =
        new Date().getFullYear() + '-' +
        (new Date().getMonth() + 1) + '-' +
        new Date().getDate() + ' ' +
        new Date().getHours() + ':' +
        (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
        (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
      var pageShowpagespageShare = getCurrentPages();
      console.log('进入pageShare', pageShowpagespageShare);
      resobj.properties.push({
        event: "mpShare",
        event_time: currentTimeShare,
        title: "",
        url_path: pageShowpagespageShare[pageShowpagespageShare.length - 1].route,
        url_params: ObjToString(pageShowpagespageShare[pageShowpagespageShare.length - 1].options),
        last_path: pageShowpagespageShare.length > 1 ?
          pageShowpagespageShare[pageShowpagespageShare.length - 2].route :
          "",
        last_params: pageShowpagespageShare.length > 1 ?
          ObjToString(pageShowpagespageShare[pageShowpagespageShare.length - 2].options) :
          "",
        duration: propshowcurrent_timepageShare.event_duration * 1000,
        is_first_day: computerTime(wx.getStorageSync('ZLZZ_SDK_Option_Data').triggerTime),//是否首天触发的事件	
        is_first_time: wx.getStorageSync('ZLZZ_SDK_Option_Data').is_first_time,//是否首次触发的事件		
        is_login: wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id ? true : false,//是否为登录状态	
        depth: pageShowpagespageShare.length//当前页面的层级	
      })
      console.log("pageShare resobj", resobj);



    }
    return console.log.apply(console, arguments)
  } catch (e) {
    console.log(arguments[0])
  }
}

//appId
//const project_id = wx.getAccountInfoSync().miniProgram.appId
const urlObj = getCurrentPages()
const url_path = urlObj
//当前时间
//获取系统当前时间
const currentTime =
  new Date().getFullYear() + '-' +
  (new Date().getMonth() + 1) + '-' +
  new Date().getDate() + ' ' +
  new Date().getHours() + ':' +
  (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
  (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))

let resobj = {
  project_id: 0,
  debug_mode: "",
  type: "",
  common: {
    udid: "",
    user_id: "",
    distinct_id: "",
    app_id: "",
    platform: "",
    time: "",
    sdk_type: "小程序",
    sdk_version: "",
    screen_height: 0,
    screen_width: 0,
    manufacturer: "",
    model: "",
    network: "",
    os: "",
    os_version: "",
    carrier: "",
    app_version: "",
    time: currentTime
  },
  properties: []
}


function formatSystem(system) {
  var _system = system.toLowerCase();
  if (_system === 'ios') {
    return 'iOS';
  } else if (_system === 'android') {
    return 'Android';
  } else {
    return system;
  }
}

//获取手机情况
function getSystemInfo() {
  wx.getSystemInfo({
    "success": function (t) {
      // console.log('t', t,wx);
      // getlogin()//获取用户唯一标识

      resobj.common.manufacturer = t["brand"];
      resobj.common.model = t["model"];
      resobj.common.os = t["system"].split(" ")[0];
      //  os_version=t["system"].split(" ")[1];
      resobj.common.screen_width = Number(t["screenWidth"]);
      resobj.common.screen_height = Number(t["screenHeight"]);
      // os = formatSystem(t["platform"]);
      resobj.common.os_version = t["system"].indexOf(' ') > -1 ? t["system"].split(' ')[1] : t["system"];
    }
  })
  var pages = getCurrentPages();

  console.log("urels", pages);
  pages
}
getSystemInfo()


setTimeout(() => {
  var pages = getCurrentPages();

  console.log("urels", pages);
}, 1000);



function post(url, params) {
  console.log(url, params)
  return url;
}

var oldApp = App;
App = function (e) {
  mp_proxy(e, "onLaunch", "appLaunch"),
    mp_proxy(e, "onShow", "appShow"),
    mp_proxy(e, "onHide", "appHide"),
    oldApp.apply(this, arguments)
};

var oldPage = Page;
Page = function (e) {
 
  var t = zjzzObj.para.autoTrack && zjzzObj.para.autoTrack.mpClick && _.getMethods(e);
  if (t)
    for (var a = 0, r = t.length; a < r; a++) click_proxy(e, t[a]);
  mp_proxy(e, "onLoad", "pageLoad"),
    mp_proxy(e, "onShow", "pageShow"),
    mp_proxy(e, "onAddToFavorites", "pageAddFavorites"),
    "function" == typeof e.onShareAppMessage && zjzzObj.autoTrackCustom.pageShare(e),
    "function" == typeof e.onShareTimeline && zjzzObj.autoTrackCustom.pageShareTimeline(e),
    oldPage.apply(this, arguments)
};


function mp_proxy(option, method, identifier) {
  var newFunc = zjzzObj.autoTrackCustom[identifier];
  if (option[method]) {
    var oldFunc = option[method];
    option[method] = function () {
      if (method === 'onLaunch') {
        this[zjzzObj.para.name] = zjzzObj;
      }
      if (!zjzzObj.para.autoTrackIsFirst || (_.isObject(zjzzObj.para.autoTrackIsFirst) && !zjzzObj.para.autoTrackIsFirst[identifier])) {
        oldFunc.apply(this, arguments);
        newFunc.apply(this, arguments);
      } else if (zjzzObj.para.autoTrackIsFirst === true || (_.isObject(zjzzObj.para.autoTrackIsFirst) && zjzzObj.para.autoTrackIsFirst[identifier])) {
        newFunc.apply(this, arguments);
        oldFunc.apply(this, arguments);
      }
    };
  } else {
    option[method] = function () {
      if (method === 'onLaunch') {
        this[zjzzObj.para.name] = zjzzObj;
      }
      newFunc.apply(this, arguments);
    };
  }
}

var ObjToString = function (obj) {
  var arr = [], tmpObj = Object.getOwnPropertyNames(obj).sort(), l = tmpObj.length;
  var i = 0;
  for (var v of tmpObj)
    arr.push(v + "=" + obj[v]);
  return arr.join("&");
};
import Api from "./apiSDK.js"
//console.log(Api);

var isfulldata = function () {
  //满足条件可以发请求

  var data = wx.getStorageSync('ZLZZ_Res_Data_Properties') || []
  if (data && data.length & data.length >= 100) {
    console.log("满足条件可以发请求");
  } else if (true) {
    console.log("满足条件可以发请求");
  }
}

var countDowntimer = ""
var countDown = function () {
  let itime = 0;
  let num = 0

  // console.log('倒计时开始');
  countDowntimer = setInterval(function () {
    if (itime == 15) {
      //clearInterval(countDowntimer);
      // countDown();
      itime = 0;
      num = 0
      //countDown();
      // console.log('倒计时结束，关闭倒计时');
      if (wx.getStorageSync('ZLZZ_Res_Data_Properties') && wx.getStorageSync('ZLZZ_Res_Data_Properties').length) {
        postTrack()

      }

    } else {

      num = ++itime
      // console.log('倒计时开始-------', num);
      if (wx.getStorageSync('ZLZZ_Res_Data_Properties') && wx.getStorageSync('ZLZZ_Res_Data_Properties').length && wx.getStorageSync('ZLZZ_Res_Data_Properties').length >= 30) {
        postTrack()

      }
    }
  }, 1000);
}
// countDown()



function getSign(params) {
  if (typeof params == "string") {
    return paramsStrSort(params);
  } else if (typeof params == "object") {
    var arr = [];
    for (var i in params) {
      arr.push((i + "=" + params[i]));
    }
    return paramsStrSort(arr.join(("&")));
  }
}

function paramsStrSort(paramsStr) {
  var url = paramsStr;
  console.log('paramsStr', paramsStr);

  var urlStr = url.split("&").sort().join("&");

  return Md5(urlStr + "&" + "e4112bcb26a291aa64eea7ca94c8b774");
}


var distinct_id = ""//kepler系统用户唯一标识
var debug_mode = "no_debug"////no_debug:关闭Debug模式;debug_and_import:开启Debug模式并导入数据;debug_and_not_import:开始Debug模式不导入数据
var project_id = ""

var init = function (obj) {
  debug_mode = obj.debug_mode || "no_debug"
  project_id = obj.project_id
  console.log('init函数', obj);
  let ZLZZ_SDK_Option_Dataobj = wx.getStorageSync('ZLZZ_SDK_Option_Data')

   if (ZLZZ_SDK_Option_Dataobj && ZLZZ_SDK_Option_Dataobj.user_id) {
      ZLZZ_SDK_Option_Dataobj.user_id = obj.user_id
      wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Dataobj)
      //！第一次登陆
      var postidentificationtime = (new Date()).getTime()
      Api.postFormid('/api/v1/identification/' + obj.project_id + "?time=" + postidentificationtime,
        {
          "user_id": obj.user_id,
          "udid": wx.getStorageSync('ZLZZ_SDK_Option_Data').openId
        }
        ,
        getSign({
          "time": postidentificationtime
        })
        , function (res) {
          distinct_id = res.data.data.distinct_id
    
          let ZLZZ_SDK_Option_Dataobjres = wx.getStorageSync('ZLZZ_SDK_Option_Data')
          ZLZZ_SDK_Option_Dataobjres.distinct_id = res.data.data.distinct_id
          if (ZLZZ_SDK_Option_Dataobjres && ZLZZ_SDK_Option_Dataobjres.triggerTime) {
             //二次登陆
            ZLZZ_SDK_Option_Dataobjres.is_first_time=false
            wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Dataobjres)
          }else{
           
    
             //首次登陆时间
                  
             let ZLZZ_SDK_Option_Dataobjresis_first_time={
              is_first_time:true,
              triggerTime: new Date().getFullYear() + '-' +
              (new Date().getMonth() + 1) + '-' +
              new Date().getDate() + ' ' +
              new Date().getHours() + ':' +
              (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
              (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
             }
             wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Dataobjresis_first_time)
          }
         
    
    
          console.log('init函数distinct_id', distinct_id);
        })
    
    
      //
   }else{
  
    let ZLZZ_SDK_Option_Dataobjuser_id={
      user_id:""
    }
    ZLZZ_SDK_Option_Dataobj=ZLZZ_SDK_Option_Dataobjuser_id
    wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Dataobj)
    //第一次登陆
    wx.login({
      success: res => {
        console.log('wx.login', res);
        ZLZZ_SDK_Openid = res.code || ""
  
        var ZLZZ_SDK_Time =
          new Date().getFullYear() + '-' +
          (new Date().getMonth() + 1) + '-' +
          new Date().getDate() + ' ' +
          new Date().getHours() + ':' +
          (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
          (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
        var ZLZZ_SDK_Option_Data = {
          openId: ZLZZ_SDK_Openid
          
        }
     
        wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Data)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var postidentificationtime = (new Date()).getTime()
        Api.postFormid('/api/v1/identification/' + obj.project_id + "?time=" + postidentificationtime,
          {
            "user_id": obj.user_id,
            "udid": wx.getStorageSync('ZLZZ_SDK_Option_Data').openId
          }
          ,
          getSign({
            "time": postidentificationtime
          })
          , function (res) {
            distinct_id = res.data.data.distinct_id
      
            let ZLZZ_SDK_Option_Dataobjres = wx.getStorageSync('ZLZZ_SDK_Option_Data')
            ZLZZ_SDK_Option_Dataobjres.distinct_id = res.data.data.distinct_id
            if (ZLZZ_SDK_Option_Dataobjres && ZLZZ_SDK_Option_Dataobjres.triggerTime) {
               //二次登陆
              ZLZZ_SDK_Option_Dataobjres.is_first_time=false
              wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Dataobjres)
            }else{
             
      
               //首次登陆时间
                    
               let ZLZZ_SDK_Option_Dataobjresis_first_time={
                is_first_time:true,
                triggerTime: new Date().getFullYear() + '-' +
                (new Date().getMonth() + 1) + '-' +
                new Date().getDate() + ' ' +
                new Date().getHours() + ':' +
                (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
                (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
               }
               wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Dataobjresis_first_time)
            }
           
      
      
            console.log('init函数distinct_id', distinct_id);
          })
      
      
      }
    })
   }
 
 


  // }

}
//保存埋点请求
var postTrack = function () {

  console.log('保存埋点请求---------');

  var ppostTracktime = (new Date()).getTime()
  var postTrackData = {

    "project_id": project_id,
    "debug_mode": debug_mode,
    "type": "track",
    "common": resobj.common,
    "properties": wx.getStorageSync('ZLZZ_Res_Data_Properties') || []

  }
  postTrackData.common.distinct_id = wx.getStorageSync('ZLZZ_SDK_Option_Data').distinct_id
  Api.postFormid('/api/v1/track/' + project_id + "?time=" + ppostTracktime,
    postTrackData
    ,
    getSign({
      "time": ppostTracktime
    })
    , function (res) {

      wx.setStorageSync('ZLZZ_Res_Data_Properties', [])
      resobj.properties = []
      console.log('保存埋点请求 成功啦');
      //countDown()//继续倒计时
    },
    function (err) {
      // countDown()//继续倒计时
      console.log('保存埋点请求 失败啦');
    })

}
//postTrack()

//保存画像请求
var postProfile = function (obj) {

  console.log('保存画像请求---------');
  let postProfiledata = {

    project_id: project_id,
    type: "user_profile",
    debug_mode: obj.debug_mode,
    common: {
      "distinct_id": (wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').distinct_id) ?
        wx.getStorageSync('ZLZZ_SDK_Option_Data').distinct_id : "",
      "user_id": (wx.getStorageSync('ZLZZ_SDK_Option_Data') && wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id) ?
        wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id : "",
      "time": new Date().getFullYear() + '-' +
        (new Date().getMonth() + 1) + '-' +
        new Date().getDate() + ' ' +
        new Date().getHours() + ':' +
        (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
        (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds())),
      "type": obj.type  // set; set_once; append; increase; delete; unset
    },
    property: {

      "first_visit_time": wx.getStorageSync('ZLZZ_First_Visit_User_Profile_Time') ||
        new Date().getFullYear() + '-' +
        (new Date().getMonth() + 1) + '-' +
        new Date().getDate() + ' ' +
        new Date().getHours() + ':' +
        (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
        (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
    }

  }
  postProfiledata.property = Object.assign(postProfiledata.property, obj.property)
  console.log('保存画像请求postProfiledata', postProfiledata);
  var ppostTracktime = (new Date()).getTime()
  Api.postFormid('/api/v1/user_profile/' + project_id + "?time=" + ppostTracktime,
    postProfiledata
    ,
    getSign({
      "time": ppostTracktime
    })
    , function (res) {
      wx.setStorageSync('ZLZZ_First_Visit_User_Profile_Time', new Date().getFullYear() + '-' +
        (new Date().getMonth() + 1) + '-' +
        new Date().getDate() + ' ' +
        new Date().getHours() + ':' +
        (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
        (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds())))
      console.log('cg保存画像请求');
    })

}
//postProfile()

var getlogin = function () {
  wx.login({
    success: res => {
      console.log('wx.login', res);
      ZLZZ_SDK_Openid = res.code || ""

      var ZLZZ_SDK_Time =
        new Date().getFullYear() + '-' +
        (new Date().getMonth() + 1) + '-' +
        new Date().getDate() + ' ' +
        new Date().getHours() + ':' +
        (new Date().getMinutes() > 9 ? new Date().getMinutes() : ("0" + new Date().getMinutes())) + ':' +
        (new Date().getSeconds() > 9 ? new Date().getSeconds() : ("0" + new Date().getSeconds()))
      var ZLZZ_SDK_Option_Data = {
        openId: ZLZZ_SDK_Openid
        
      }
   
      wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Data)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  })
}

//wx.getStorageSync('ZLZZ_SDK_Option_Data').user_id

var login = function (obj) {
  debug_mode = debug_mode || "no_debug"
  project_id = project_id
  console.log('login函数', obj);
  // let ZLZZ_SDK_Option_Dataobj = wx.getStorageSync('ZLZZ_SDK_Option_Data')
  // // if ((ZLZZ_SDK_Option_Dataobj && ZLZZ_SDK_Option_Dataobj.user_id)) {
  // ZLZZ_SDK_Option_Dataobj.user_id = obj.user_id
  // wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Dataobj)

  var postidentificationtime = (new Date()).getTime()
  Api.postFormid('/api/v1/identification/' + project_id + "?time=" + postidentificationtime,
    {
      "user_id": obj.user_id,
      "udid": wx.getStorageSync('ZLZZ_SDK_Option_Data').openId
    }
    ,
    getSign({
      "time": postidentificationtime
    })
    , function (res) {
      distinct_id = res.data.data.distinct_id
      let ZLZZ_SDK_Option_Datalogins = wx.getStorageSync('ZLZZ_SDK_Option_Data')

      ZLZZ_SDK_Option_Datalogins.user_id = obj.user_id
      ZLZZ_SDK_Option_Datalogins.distinct_id = res.data.data.distinct_id
      wx.setStorageSync('ZLZZ_SDK_Option_Data', ZLZZ_SDK_Option_Datalogins)


      console.log('init函数distinct_id', distinct_id);
    })


  //}
}

var logout = function () {

  var logoutuser_id = wx.getStorageSync('ZLZZ_SDK_Option_Data')
  logoutuser_id.user_id = ""
  wx.setStorageSync('ZLZZ_SDK_Option_Data', logoutuser_id)
}



export default {
  init,
  login,
  logout,
  customEvents,
  postProfile
}