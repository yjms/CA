// pages/takeHome/takeHome.js
let app = new getApp();
import https from '../../utils/api/my-requests.js';

import tool from '../../utils/publics/tool.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		BASEURL: app.globalData.ASSETSURL,
		useData:{},
		iscope:false,
		carlist: [
			{ txt: 'D60', img:'/ca_d60.png'},
			{ txt: 'D60EV', img:'/ca_d60ev.png'},
			{ txt: 'E30', img: '/ca_e30.png' },
			{ txt: 'T60', img: '/ca_t60.png' },
			{ txt: 'T60EV', img: '/ca_t60ev.png' },
			{ txt: 'T70', img: '/ca_t70.png' },
			{ txt: 'T90', img: '/ca_t90.png' },
			{ txt: '星', img: '/ca_xing.png' }
			]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getInfo();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	authBtn(e){
		console.log(e)
		let useobj = e.detail.userInfo;
		let dat = {
			app_id:'wx1d585c8c2fffe589',
			openid: 'oORV85Qy9_-ER065XkxiWzF3Z7ao',
			nickname: useobj.nickName,
			avatar: useobj.avatarUrl
		}
		https.clientLogin(dat).then((res)=>{
			console.log(res);
		})
	},
	getInfo(){//获取专营店信息
		https.getPosition().then((res)=>{// 获取地理位置
			console.log(res.result.ad_info.location);
			let locat = res.result.ad_info.location;
			let dat = {
				lon: locat.lng,
				lat: locat.lat
			}
			https.getInfo(dat).then((res) => {
				console.log(res);
				if(res.data.code==1){
					console.log(res);
					this.setData({useData:res.data.data[0]})
				}
			})
		})
		
	},
	copeTxt(){
		this.setData({iscope:false});
	},
	addwx(){
		this.setData({iscope:true});
	},
	takeMan(){
		tool.jump_nav(`/pages/take/takeDel`);
	}
})