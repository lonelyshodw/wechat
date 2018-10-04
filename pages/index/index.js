//index.js
//获取应用实例
const app = getApp()
//引入一个模拟数据库  只能使用相对路径
var postdata=require("../../data/posts-data.js");
Page({
  data: {
    imgUrls: [
      '/image/headimages/crab.png',
    '/image/headimages/bl.png',
    '/image/headimages/sls.jpg'],
    indicatorDots:true,
    autoplay: true,
    interval: 1000,
    duration: 1000
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //不能使用this.data方法是因为异步方法所以不能显示
    //建议尽量使用this.setData({});
   //this.data.postList=postdata.postList;
    this.setData({
        //引用模拟数据库中的数据，并回写到data数据区
      postList:postdata.postList
    });
  },
    onPostTap:function (event) {
    //获取前台的自定义数据dataset可以定义很多数据
      var postId=event.currentTarget.dataset.postid;
        wx.navigateTo({
          url: 'index-detail/index-detail?id='+postId
        })
    },
    onSwiperTap:function (event) {
        var postId=event.target.dataset.postid;
        wx.navigateTo({
          url: 'index-detail/index-detail?id=' + postId
        })
    }
})
