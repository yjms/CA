//alert提示
const alert = (str, duration = 1500, icon = "none", callback) => {
  wx.showToast({
    title: str,
    icon: icon,
    duration: duration,
    success: () => {
      if (!callback) return
      setTimeout(() => { callback() }, duration)
    }
  })
}
//loading提示框
const loading = (str = '加载中', mask = false) => {
  wx.showLoading({
    title: str,
    mask: mask
  })
}
//关闭loading提示框
const loading_h = () => {
  wx.hideLoading()
}
//确认/取消弹框
const showModal = (title = "确认", content = "您确认进行此操作？", confirms = "确认,#333", cancels = "取消,#333") => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      showCancel: cancels ? true : false,
      cancelText: cancels ? cancels.split(",")[0] : '取消',
      cancelColor: cancels ? cancels.split(",")[1] : '#333',
      confirmText: confirms.split(",")[0],
      confirmColor: confirms.split(",")[1],
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}
//小程序信息
const getWxConfig = () => {
  return new Promise((resolve) => {
    resolve(__wxConfig)
  })
}
//获取手机系统信息
const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success(res) {
        resolve(res)
      }
    })
  })
}
//获取dom节点
const getDom = ele => {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(ele).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => {
      resolve(res)
    })
  })
}
//设置tabbar右上角文字
const setTab = (index, value) => {
  wx.setTabBarBadge({
    index: index,
    text: typeof value == 'number' ? value + '' : value
  })
}
//播放视频
const videoPlay = (ele, isFullScreen = true) => {
  let videoContext = wx.createVideoContext(ele)
  console.log(videoContext)
  videoContext.play()
  // if (isFullScreen) {
  //   videoContext.requestFullScreen({ direction: 0 })
  // }
}
//可返回跳转
const jump_nav = (url) => {
  wx.navigateTo({
    url: url
  })
}
//不可返回跳转
const jump_red = (url) => {
  wx.redirectTo({
    url: url
  })
}
//清除页面栈跳转
const jump_rel = (url) => {
  wx.reLaunch({
    url: url
  })
}
//跳转tabBar页
const jump_swi = (url) => {
  wx.switchTab({
    url: url
  })
}
//返回上一页面
const jump_back = () => {
  wx.navigateBack()
}
//预览图片
const previewImage = (urls, current) => {
  wx.previewImage({
    urls: urls,
    current: current
  })
}
//canvas绘图生成海报图片
const canvasImg = (options, callback) => {
  return new Promise((resolve, reject) => {
    const ctx = wx.createCanvasContext(options.canvasId);
    ctx.setFillStyle('#fff')
    ctx.rect(0, 0, options.canvasSize.split("*")[0], options.canvasSize.split("*")[1])
    ctx.fill()
    if (options.imgList && options.imgList.length > 0) {
      let _allNum = options.imgList.length || 0
      let _curNum = 0
      let _getImage = []
      _getImageInfo()
      function _getImageInfo() {
        let _curimg = options.imgList[_curNum]
        getImageInfo(_curimg.url).then(res => {
          _curNum++
          _getImage.push(res)
          if (_curNum >= _allNum) {
            _drawImage()
          } else { _getImageInfo() }
        })
      }
      function _drawImage() {
        for (let i = 0; i < _getImage.length; i++) { 
          let _curimg = options.imgList[i]
          _curimg.url = _getImage[i].path
          _curimg.imgW = _getImage[i].width
          _curimg.imgH = _getImage[i].height
          if (_curimg.isRadius) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(_curimg.imgX + (_curimg.drawW || _curimg.imgW) / 2, _curimg.imgY + (_curimg.drawH || _curimg.imgH) / 2, (_curimg.drawW || _curimg.imgW) / 2, 0, 2 * Math.PI)
            ctx.clip()
          }
          let _scale = 1
          let _drawW = _curimg.imgW
          let _drawH = _curimg.imgH
          if (_curimg.drawW) {
            _scale = Math.min(_curimg.imgW / _curimg.drawW, _curimg.imgH / _curimg.drawH)
            _drawW = _curimg.drawW * _scale
            _drawH = _curimg.drawH * _scale
          }
          ctx.drawImage(_curimg.url, (_curimg.imgW - _drawW) / 2, (_curimg.imgH - _drawH) / 2, _drawW, _drawH, _curimg.imgX, _curimg.imgY, _curimg.drawW || _curimg.imgW, _curimg.drawH || _curimg.imgH)
          ctx.restore()
        if (i == _getImage.length - 1) {
            drawNext()
          }
        }
      }
    } else {
      drawNext()
    }
    function drawNext() {
      if (options.textList && options.textList.length > 0) {
        let _textList = options.textList
        for (let i = 0; i < _textList.length; i++) {
          let _wrap = _textList[i].wrap
          let _h = _textList[i].textY
          let _string = _textList[i].string
          if (_textList[i].string.length > _textList[i].wrap) {
            let _arrText = []
            _arrText = [_textList[i].string]
            let _x = 0
            let _this = this
            calcImgText(_x)
            function calcImgText(x) {
              for (let j = 0; j <= (_arrText[x].length / _textList[i].wrap); j++) {
                if (_arrText[x].slice(j * _wrap, (j + 1) * _wrap) == '') { continue }
                let _item = cloneObj(_textList[i])
                _item.string = _arrText[x].slice(j * _wrap, (j + 1) * _wrap)
                _item.textY = _h
                _textList.push(_item)
                _h += _item.lineHeight
              }
              if (_x < _arrText.length - 1) {
                _x++
                calcImgText(_x)
              }
            }
            function cloneObj(obj) {
              var newObj = {};
              if (obj instanceof Array) {
                newObj = [];
              }
              for (var key in obj) {
                var val = obj[key];
                newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
              }
              return newObj;
            }
            _textList.splice(i, 1)
          }
        }
        for (let i = 0; i < options.textList.length; i++) {
          let _curText = options.textList[i]
          ctx.font = "50px ygyxsziti2"
          ctx.setFontSize(_curText.fontSize)
          ctx.setFillStyle(_curText.color)
          ctx.setTextAlign('left')
          ctx.setTextBaseline('top')
          ctx.fillText(_curText.string, _curText.textX, _curText.textY)
          if (_curText.bold) {
            ctx.fillText(_curText.string, _curText.textX, _curText.textY - 0.5)
            ctx.fillText(_curText.string, _curText.textX - 0.5, _curText.textY)
          }
          ctx.fillText(_curText.string, _curText.textX, _curText.textY)
          if (_curText.bold) {
            ctx.fillText(_curText.string, _curText.textX, _curText.textY + 0.5)
            ctx.fillText(_curText.string, _curText.textX + 0.5, _curText.textY)
          }
        }
        //ctx.draw(true)
      }
      ctx.draw(true, () => {
        setTimeout(() => {
          canvasToTempImage(options.canvasId).then(res => {
            resolve(res)
          })
        }, 100)
      })
    }
  })
}
//获取图片信息
const getImageInfo = imgUrl => {
  return new Promise(resolve => {
    wx.getImageInfo({
      src: imgUrl,
      success(res) {
        resolve(res)
      }
    })
  })
}
//把canvas转换成本地图片路径
const canvasToTempImage = (canvasId, w, h, x = 0, y = 0) => {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvasId,
      x: x,
      y: y,
      width: w,
      height: h,
      success(res) {
        resolve(res.tempFilePath)
      },
      fail(res) {
        reject(res);
      }
    })
  })
}

//选择文件
const chooseMessageFile = (count = 1) => {
  return new Promise(resolve => {
    wx.chooseMessageFile({
      count: count,
      type: 'file',
      success(res) {
        resolve(res)
      }
    })

  })
}
/*上传文件*/
const uploadFiles = (filePathArr, url) => {
  let imgList = []
  let _ulloadNum = 0
  return new Promise((resolve, reject) => {
    let eachUpload = () => {
      if (_ulloadNum >= filePathArr.length) {
        resolve(imgList)
        return
      }
      let uploadTask = wx.uploadFile({
        url: url,
        filePath: filePathArr[_ulloadNum],
        name: 'file',
        success: function (res) {
          imgList.push(JSON.parse(res.data).data.src)
          _ulloadNum++
          eachUpload()
        },
        fail(err){
          reject(err)
        }
      })
      // uploadTask.onProgressUpdate((res) => {
      //   console.log('上传进度', res.progress)
      //   console.log('已经上传的数据长度', res.totalBytesSent)
      //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      // })
    }
    eachUpload()
  })
}
//查看文件
const openDocument = filePath => {
  wx.downloadFile({
    // 示例 url，并非真实存在
    url: filePath,
    success(res) {
      wx.openDocument({
        filePath: res.tempFilePath,
        success(res) {
          console.log('打开文档成功')
        }
      })
    }
  })
}
module.exports = {
  alert,
  showModal,
  loading,
  loading_h,
  getWxConfig,
  getSystemInfo,
  getDom,
  setTab,
  videoPlay,
  jump_nav,
  jump_red,
  jump_rel,
  jump_swi,
  jump_back,
  previewImage,
  canvasImg,
  getImageInfo,
  canvasToTempImage,
  chooseMessageFile,
  uploadFiles,
  openDocument
}