// pages/pages-list/circle/circle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circle: {
      width: 250,//进度条宽度，单位px
      crude: 10,//进度条厚度
      fontStyle: ["80rpx", "#000"],//进度条中间文字样式
      speed: 60,//进度条加载动画速率
      progress: 75//进度条进度值
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // setTimeout(() => {
    //   let _circle = this.data.circle
    //   _circle.progress = 50
    //   this.setData({ circle: _circle})
    //   console.log(this.data.circle.progress)
    // }, 7000)
  }
})