var util=require('../../utils/util.js')
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{},
    searchResult:{},
    containerShow:true,
    searchPanelShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //声明三个路径
    var inTheatersUrl=app.globalData.doubanBase+"/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    //调用获得电影的函数
    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣Top250");
  },
  onMoreTap:function(event){
    var category=event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },
  getMovieListData:function(url,settedKey,categoryTitle){
    var that=this;
    wx.request({
      url: url,
      method:'GET',
      header:{
        "Content-Type":"json"
      },
      success:function(res){
        //res.data是响应的数据
        that.processDoubanData(res.data, settedKey, categoryTitle)
      }
    })
  },
  //请求数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    var movies=[];
    for(var idx in moviesDouban.subjects){
      var subject=moviesDouban.subjects[idx];
      var title=subject.title;
      if(title.length>=6){
        title=title.substring(0,6)+"...";
      }
      var temp={
        stars:util.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id,
      }
      movies.push(temp)
    }
    var readData={};
    readData[settedKey]={
      categoryTitle:categoryTitle,
      movies:movies
    }
    this.setData(readData);
  },
  //搜索相关事件
  onCancelImgTap:function(event){
    this.setData({
      containerShow:true,
      searchPanelShow:false,
      searchResult:{}
    })
  },
  onBindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },
  onConfirm:function(event){
    var text=event.detail.value;
    var searchUrl=app.globalData.doubanBase+"/v2/movie/search?q="+text;
    this.getMovieListData(searchUrl,"searchResult","");
  },

})