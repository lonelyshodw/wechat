// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    //根据获得的路径发出请求
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },
  //下拉刷新
  onScrollLower: function(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  //
  onSrolltoupper: function() {
    var that=this;
    wx.startPullDownRefresh({
      success:function(event){
        var refreshUrl = that.data.requestUrl + "?start=0&count=20";
        that.data.movies = {};
        that.data.isEmpty = true;
        that.data.totalCount = 0;
        util.http(refreshUrl, that.processDoubanData);
        wx.showNavigationBarLoading();
      }
    })
   
  },
  processDoubanData: function(moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp)
    }
    //控制下拉刷新的电影数量
    var toatalMovies = {};
    if (!this.data.isEmpty) {
      toatalMovies = this.data.movies.concat(movies);
    } else {
      toatalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: toatalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },
})