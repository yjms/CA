// pages/pages-list/map/index.js
import tool from '../../../utils/publics/tool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  jumps: function (e) {
    var page = e.currentTarget.dataset.page
    tool.jump_nav(`/pages/pages-list/map/${page}`)
    // wx.navigateTo({
    //   url: '/pages/pages-list/charts/charts/' + page + '/' + page
    // });
  }
})