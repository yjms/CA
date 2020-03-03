//index.js
// import login from '../../utils/api/login.js'
import mta from '../../utils/mta_analysis.js'
import tool from '../../utils/publics/tool.js'
import util from '../../utils/util.js'
import https from '../../utils/api/my-requests.js'
// import backgroundAudio from '../../utils/backgroundAudio.js'
let app = new getApp();
Page({
  data: {
    contentType: 0,//页面内容类型0为小程序模板内容，1为h5游戏嵌入小程序壳子审核专用内容
	BASEURL: app.globalData.ASSETSURL,
  },
  onLoad() {
    mta.Page.init()//腾讯统计
    login.login().then(res => {
      console.log("【静默登录成功】", res)
      //     /userId
    })
  },
  onShow() {
	//   wx.qy.login({
	// 	  success:function(rel){
	// 		  console.log(rel);
	// 		  https.getuseid({code:rel.code}).then((res)=>{
	// 			  console.log(res);
	// 		  })
	// 	  }
	//   })
  },
  onShareAppMessage() {
	  
  }
})
