//index.js
import mta from '../../utils/mta_analysis.js'
import tool from '../../utils/publics/tool.js'
import util from '../../utils/util.js'
import https from '../../utils/api/my-requests.js'
import auth from '../../utils/publics/authorization.js'
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
	  currtab:1,//展示当前tab
	  showModalOption: {
		  isShow: false,
		  type: 0,
		  title: "访问手机相册",
		  test: "小程序将访问您的手机相册，将生成的海报保存到您的手机相册。",
		  cancelText: "取消",
		  confirmText: "确定",
		  color_confirm: "#0BB20C"
	  },//确定生成海报弹窗
	  posterImgUrl: '',// 海报路径
	  isIos: 0,//是否是ios
	  hbsucc:false,//是否生成海报成功
	  usernick:null,
	  selfData:null,//自身数据
	  selfimg:null,//海报二维码
  },
  onLoad() {
      mta.Page.init();//腾讯统计
	  https.qylogin().then((res)=>{
		  console.log('----',res);
		  https.getuseid({ code: res.code }).then((res) => {
			  console.log('uid', res, res.data.data.userid)
			  this.setData({ uid: res.data.data.userid, usernick: res.data.data.name, selfData:res.data.data});
			  console.log(app.globalData.socketOpen,"首页打印");
			  app.globalData.uid = res.data.data.userid;
			  this.msgList();
			  this.creatSocket();
			  this.getcardImg();
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
	  this.data.isfirst != 1 ? this.msgList():this.setData({isfirst:++this.data.isfirst});
	  if (this.data.uid) this.acceptmag();
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
				console.log(this.data.uid + 'A');
				console.log("====",JSON.stringify(res.data.data));
			}
		})
	},
	takeDel(e){// 跳转至消息详情
		let obj = e.currentTarget.dataset.obj;
		this.setData({ to_uid: obj.client_id});
		this.cleaninfo();
		tool.jump_nav(`/pages/take/takeDel/takeDel?uid=${obj.service_id}&to_uid=${obj.client_id}&handimg=${obj.client_avatar}&useimg=${this.data.usernick}`)
	},
	cleaninfo(){ // 清除消息记录
		let dat = {
			uid:this.data.uid+'A',
			to_uid:this.data.to_uid
		}
		https.cleaninfo(dat).then((res)=>{
			console.log(res);
		}).catch((err)=>{
			console.log(err);
		})
	},
	creatSocket() { // 绑定用户
		this.setData({ socketOpen: app.globalData.socketOpen })
		this.bindUse(); // 绑定用户
		this.acceptmag();// 接收socekt
	},
	bindUse() {// 绑定 
		wx.sendSocketMessage({
			data: '{"type":"bind","uid":"' + this.data.uid + 'A"}'
		})
	},
	acceptmag() {//接收信息 is_ob: 1 自己 0 别人  msg_type为接收的信息类型 msg_type:1 为文字 2为图片
		let self = this;
		let arr = [];
		wx.onSocketMessage(function (msg) {
			let data = JSON.parse(msg.data);
			let code = data.code;
			let type = data.type;
			if (code != 1) return;
			switch (type) {
				case 'receive': {
					self.msgList();
					break;
				}
			}
		})
	},
	changeTab(e){// 切换 页面
		let type = e.currentTarget.dataset.type;
		this.setData({currtab:type});
		// console.log(type);
	},
	generate(){// 点击生成海报
		this.setData({ hbsucc:true});
		this.getSharePoster();
	},
	// 生成海报
	//获取分享海报
	getSharePoster() {
		var _this = this
		tool.loading("海报生成中", "loading")
		this.data.canvasLoading = setTimeout(() => {
			if (!this.data.posterImgUrl) {
				tool.loading_h()
				tool.alert("海报生成失败，请稍后再试")
			}
		}, 15000)
		tool.canvasImg({
			canvasId: 'myCanvas',
			canvasSize: '694*1019',
			imgList: [
				{ url: "https://game.flyh5.cn/resources/game/wechat/szq/images/poster.jpg", drawW: 530, drawH: 555, imgX: 22, imgY: 22 },
				{ url: `${this.data.selfimg}`, drawW: 160, drawH: 160, imgX: 382, imgY: 616 }
			],
			textList: [//this.data.userInfo.nickName
				{ string: `${this.data.selfData.name}`, color: '#373737', fontSize: '28', fontFamily: 'Arial', bold: false, textX: 27, textY: 617, wrap: 5, lineHeight: 30 },
				{ string: `${this.data.selfData.store}`, color: '#333333', fontSize: '29', fontFamily: 'Arial', bold: false, textX: 26, textY: 683, wrap: 13, lineHeight: 30 },
				{ string: `手机：${this.data.selfData.phone}`, color: '#9fa0a0', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 26, textY: 737 },
				{ string: `地址：`, color: '#9fa0a0', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 26, textY: 767 },
				{ string: `${this.data.selfData.address}`, color: '#9fa0a0', fontSize: '20', fontFamily: 'Arial', bold: false, wrap: 12, lineHeight: 30, textX: 88, textY: 767 },
				{ string: `长按二维码识别`, color: '#333333', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 386, textY: 797 }
			],
			textbg: [//this.data.userInfo.nickName
				{ string: `${this.data.selfData.position}`, color: '#fff', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 190, textY: 617, bg: '#02216D' }
			]
		}).then(res => {
			console.log("res", res)
			tool.loading_h()
			_this.setData({
				isPosterOk: true,
				posterImgUrl: res
			})
		})
	},
	//保存到相册
	savePhoto() {
		tool.loading("海报保存中", "loading")
		this.isSettingScope()
	},
	//判断是否授权访问手机相册
	isSettingScope() {
		let _self = this
		auth.isSettingScope("scope.writePhotosAlbum", res => {
			console.log("res", res)
			if (res.status == 0) {
				tool.loading_h();
				_self.showHideModal();
			} else if (res.status == 1 || res.status == 2){
				_self.saveImageToPhotosAlbum(this.data.posterImgUrl)
			}
		})
	},
	//将canvas生成的临时海报图片保存到手机相册
	saveImageToPhotosAlbum(imgUrl){
		let _this = this;
		wx.saveImageToPhotosAlbum({
			filePath: imgUrl,
			success(res) {
				setTimeout(() => {
					tool.alert("已保存到手机相册")
					_this.setData({
						canvasHidden: false,
						isShare: true,
						hbsucc:false
					})
				}, 600)
			},
			fail() {
				tool.alert("保存失败");
				_this.setData({hbsucc:false})
			},
			complete() {
				tool.loading_h()
			}
		})
	},
	//点击自定义Modal弹框上的确定按钮
	operation(e) {
		if (e.detail.confirm) {
			auth.openSetting(res => {//用户自行从设置勾选授权后
				if (res.authSetting["scope.writePhotosAlbum"] && this.data.posterImgUrl) {
					this.saveImageToPhotosAlbum(this.data.posterImgUrl)
				}
			})
		}
		this.showHideModal()
	},
	//打开、关闭自定义Modal弹框
	showHideModal(){
		let _showModalOption = this.data.showModalOption
		_showModalOption.isShow = !_showModalOption.isShow
		this.setData({ showModalOption: _showModalOption })
	},
	// 获取二维码
	getcardImg(){
		let dat = {
			userid:this.data.uid
		}
		https.getcardImg(dat).then((res)=>{
			console.log(res);
			this.setData({ selfimg:res.data.data});
		})	
	}
})
