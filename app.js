//app.js
import auth from './utils/publics/authorization.js'
import backgroundAudio from './utils/backgroundAudio.js'
import robotInit from './pages/pages-list/robot/robot-init.js'
App({
  onLaunch(opation) {
    //腾讯统计
    auth.statistics(500689212)
    //背景音乐
    // backgroundAudio.backMusic(this, 'https://game.flyh5.cn/resources/game/wechat/szq/ftxiyouji/images/music.mp3')
    //机器人
    robotInit.robotInit()
  },
  globalData: {
	REQUESTURL: 'http://t4jmh3.natappfree.cc/index.php',//接口请求路径
	ASSETSURL: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/ca'//线上资源路径
  }
})