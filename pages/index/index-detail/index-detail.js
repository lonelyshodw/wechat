// pages/index/index-detail/index-detail.js
var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //音乐是否播放的标记
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获得其他页面传递的值
    var postId = options.id;
    //设置获取到的页面id值到data域中
    this.data.currentPostId = postId;
    //根据id获取到页面的数据
    var postData = postsData.postList[postId];
    //this.data.postData=postData;
    //按照获取的ID显示对应的数据
    this.setData({
      postData: postData
    })
    //从缓存中获取所有页面的收藏状态
    var postsCollected = wx.getStorageSync("posts_collected")
    if (postsCollected) {
      //根据id获取当前页面的收藏状况
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      //保证逻辑完整性
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected)
    };
    //监听音乐播放函数
    if (app.globalData.g_isPlayingMusic&&app.globalData.g_currentMusicPostId===postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMointor();
    
  },
  //监听音乐的播放、暂停、停止(监听总开关和音乐播放图标)
  setMusicMointor: function() {
    var that=this;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onPlay(function(event) {
     // var pages=getCurrentPages();
    //  var currentPage=pages[pages.length-1];
    //  if(currentPage.data.currentPostId===that.data.currentPostId){
   //     if(app.globalData.g_currentMusicPostId==that.data.currentPostId){
          that.setData({
            isPlayingMusic:true
          })
       // }
   //   }
      app.globalData.g_isPlayingMusic=true;
      app.globalData.g_currentMusicPostId=that.data.currentPostId
    });
    backgroundAudioManager.onPause(function(){
      //var pages = getCurrentPages();
     // var currentPage = pages[pages.length - 1];
     // if (currentPage.data.currentPostId === that.data.currentPostId) {
      //  if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          that.setData({
            isPlayingMusic: false
          })
      //  }
     // }
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId =null;
    });
    backgroundAudioManager.onStop(function(){
      that.setData({
        isPlayingMusic:false
      })
      app.globalData.g_isPlayingMusic=false;
      app.globalData.g_currentMusicPostId = null;
    });

  },
  //音乐播放
  onMusicTap: function() {
    // var that=this;
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    if (isPlayingMusic) {
      backgroundAudioManager.pause();
      this.setData({
        isPlayingMusic: false,
      })
      app.globalData.g_isPlayingMusic = false;
    } else {
      backgroundAudioManager.title = postData.music.title;
      // backgroundAudioManager.epname = postData.music.title;
      backgroundAudioManager.coverImgUrl = postData.music.coverImg
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = postData.music.url
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_currentMusicPostId=this.data.currentPostId;
      app.globalData.g_isPlayingMusic = true
    }
  },

  //收藏事件
  onColletionTap: function(event) {
    //同步函数
    // this.getCollectedSync();
    //异步函数
    this.getCollectedAny();
  },
  getCollectedAny: function() {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        //通过res.data获得 key: 'posts_collected'的值
        var postsCollected = res.data;
        //根据当前的id获得列表中的收藏状况
        var postCollected = postsCollected[that.data.currentPostId];
        //对收藏状况取反 真反转为假，假反转为真
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        //重新设置缓存 调用函数
        that.showToast(postsCollected, postCollected);
      },
    })
  },
  getCollectedSync: function() {
    var postsCollected = wx.getStorageSync("posts_collected");
    //根据当前的id获得列表中的收藏状况
    var postCollected = postsCollected[this.data.currentPostId];
    //对收藏状况取反 真反转为假，假反转为真
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    //重新设置缓存 调用函数
    this.showToast(postsCollected, postCollected);
    // wx.setStorageSync("posts_collected", postsCollected);
    // this.setData({
    //   collected:postCollected
    // })
  },
  showModal: function(postsCollected, postCollected) {
    //通过给this赋值传递整个页面的引用
    var that = this;
    //调用对话框函数
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmColor: "#333",
      confirmText: "确认",
      success: function(res) {
        if (res.confirm) { //res中只能调用是否点击确认或者取消函数
          //重新设置缓存
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  showToast: function(postsCollected, postCollected) {
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      icon: 'success',
      image: '',
      duration: 1000,
      mask: false,
    })
  },
  onShareTap: function() {
    var itemList = [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ好友",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#333",
      success: function(res) {
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法分享功能"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})