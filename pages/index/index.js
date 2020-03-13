//index.js
import mta from '../../utils/mta_analysis.js'
import tool from '../../utils/publics/tool.js'
import util from '../../utils/util.js'
import https from '../../utils/api/my-requests.js'
// import backgroundAudio from '../../utils/backgroundAudio.js'
let app = new getApp();
Page({
  data: {
      contentType: 0,//页面内容类型0为小程序模板内容，1为h5游戏嵌入小程序壳子审核专用内容
	  BASEURL: app.globalData.ASSETSURL,//资源基本路径
	  msg: '',//发送的信息
	  socketOpen: false,//是否连接
	  socketMsgQueue: [],//消息队列
	  sendload: [],// 消息数据
	  msg_type: 1,// 发送消息类型
	  page: 0,// 当前页
	  havpage: true,//是否还有下一页
	  uid:null, //自己的id
	  infoList:[],//消息列表
	  isfirst:1,//是否是第一次进列表
	  to_uid:null,//给别人发消息id  
  },
  onLoad() {
      mta.Page.init()//腾讯统计
	  https.qylogin().then((res)=>{
		  https.getuseid({ code: res.code }).then((res) => {
			  this.setData({ uid: res.data.data.userid});
				
			  console.log(app.globalData.socketOpen);
			  this.msgList();
		  })
	  })
	  
  },
	/**
	   * 页面相关事件处理函数--监听用户下拉动作
	   */
	onPullDownRefresh: function () {
		if (this.data.havpage) {
			this.setData({ page: ++this.data.page });
			this.msgLog();
		} else {
			tool.alert("无更多信息！");
		}
		setTimeout(() => {
			wx.stopPullDownRefresh();
		}, 800)
	},
  onShow() {
	  this.data.isfirst != 1 ? this.msgList():this.setData({isfirst:++this.data.isfirst})
  },
  onHide(){

  },
  onShareAppMessage() {
	  
  },
  msgList(){ // 获取消息记录 
		let dat = {
			uid:this.data.uid+'A'
		}
		https.msgList(dat).then((res)=>{
			if(res.data.code==1){
				this.setData({ infoList:res.data.data});
			}
		})
	},
	takeDel(e){// 跳转至消息详情
		let obj = e.currentTarget.dataset.obj;
		this.setData({ to_uid: obj.client_id});
		this.cleaninfo();
		tool.jump_nav(`/pages/take/takeDel/takeDel?uid=${obj.service_id}&to_uid=${obj.client_id}&handimg=${obj.client_avatar}`)
	},
	cleaninfo(){ // 清除消息记录
		let dat = {
			uid:this.data.uid,
			to_uid:this.data.to_uid
		}
		https.cleaninfo().then((res)=>{
			console.log(res);
		}).catch((err)=>{
			console.log(err);
		})
	}
})
