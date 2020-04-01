//app.js
import auth from './utils/publics/authorization.js'
import backgroundAudio from './utils/backgroundAudio.js'
import robotInit from './pages/pages-list/robot/robot-init.js'
import tool from './utils/publics/tool.js'
App({
  onLaunch(opation) {
    //腾讯统计
    auth.statistics(500689212)
    //背景音乐
    // backgroundAudio.backMusic(this, 'https://game.flyh5.cn/resources/game/wechat/szq/ftxiyouji/images/music.mp3')
    //机器人
    //  robotInit.robotInit();
	  this.scoketInit();
  },
    creatSocket(){
		console.log('链接socket')
		let self = this;
		wx.connectSocket({
			url: self.globalData.SOCKETURL,
			success(res) {
				self.listlenskt();
			},
			fail(res) {
				tool.loading_h();
				console.log('=====连接失败====' + res);
			},
			complete(dat) {
				setTimeout(()=>{
					tool.loading_h();
					if (!self.globalData.socketOpen) {
						console.log(self.globalData.socketOpen);
						self.globalData.linkNum = ++self.globalData.linkNum;
						self.scoketInit();
					}
				},500)
			}
		})

	},
	listlenskt() {// 监听socket
		console.log(666)
		let self = this;
		wx.onSocketOpen((res) => {
			console.log('=====socket打开成功！=====');
			tool.loading_h();
			self.globalData.socketOpen = true;
			self.globalData.linkNum = 1;
			self.bindUse(); // 绑定用户
			self.scoketClose();// 监听socket关闭
			self.scoketErr();
		})
	},
	bindUse() {// 全局发送心跳 
		let time = null;
		clearInterval(time);
		time = setInterval(() => {// 发送心跳
			wx.sendSocketMessage({
				data: '{"type":"ping"}'
			})
		}, 50000)
		if(this.globalData.uid){
			console.log(6666)
			wx.sendSocketMessage({
				data: '{"type":"bind","uid":"' + this.data.uid + 'A"}'
			})
		}
	},
	scoketClose() {// 监听socket 关闭事件 重连
		let self = this;
		wx.onSocketClose((res) => {
			self.globalData.socketOpen = false;
			console.log("=====socket关闭原因=====", res);
			self.scoketInit();
		})
	},
	scoketInit() { // 初始化socket
		console.log("初始化",this.globalData.socketOpen);
		let time = null;
		let self = this;
		clearInterval(time);
		if (!self.globalData.socketOpen && self.globalData.linkNum == 0) { // 第一次直接连接
			console.log("第一次连接")
			self.creatSocket();
		} else { //  重连 10秒一次
			time = setInterval(() => {
				if (!self.globalData.socketOpen && self.globalData.linkNum <= 10) {
					clearInterval(time);
					self.creatSocket();
					//`第${self.globalData.linkNum - 1}次重连！`
					tool.loading(`第${self.globalData.linkNum - 1}次重连！`);
				} else {
					if (!self.globalData.socketOpen)
						tool.alert('服务器开小差了！');
					    clearInterval(time);
				}
			}, 50000)

		}
	},
	scoketErr() {// 监听socket 错误时 重连
		let self = this;
		wx.onSocketError((res) => {
			self.globalData.socketOpen = false;
			console.log("=====socket错误=====", res);
			self.scoketInit();
		})
	},
  globalData: {
	  REQUESTURL: 'http://qqjzwx.natappfree.cc/index.php',//接口请求路径
	ASSETSURL: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/ca',//线上资源路径
	socketOpen:false,//是否成功链接socket
	linkNum:0,// 链接socket次数
	SOCKETURL:'wss://wss.vrupup.com/ca:443', // socket链接
	uid:null,//重新绑定 uid
  }
})