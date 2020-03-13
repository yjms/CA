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
     robotInit.robotInit();
	  tool.loading(); 
	  let time = null;
	  time = setInterval(()=>{
		  console.log()
		if (!this.globalData.socketOpen){
				this.creatSocket();
				this.globalData.link = ++this.globalData.link;
			}else{
				clearInterval(time);
			}
			if(this.globalData.link>=10){
				tool.alert("网络链接失败！")
			}
		},1000)
	
	
  },
   creatSocket() {// 全局创建scoket
		let self = this;
		wx.connectSocket({
			url: 'ws://192.168.1.193:8282'
		})
		wx.onSocketOpen(function (res) {
			self.globalData.socketOpen = true;
			tool.loading_h(); 
			self.bindUse();
		})
	},
	bindUse() {// 全局发送心跳 
		let time = null;
		clearInterval(time);
		time = setInterval(() => { // 发送心跳
			wx.sendSocketMessage({
				data: '{"type":"ping"}'
			})
		}, 50000)
	},
  globalData: {
	REQUESTURL: 'http://9wfte5.natappfree.cc/index.php',//接口请求路径
	ASSETSURL: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/ca',//线上资源路径
	socketOpen:false,
	link:0,
  }
})