var http=require('http')
var fs=require('fs');
var cheerio=require('cheerio');
var request=require('request');
var i=0;
var url="http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";
//初始化url
function fetchPage(x) {
    startRequest(x);
}
function startRequest() {
    //采用http模块向服务器发起一次get请求
    http.get(x,function (res) {
        var html='';
        var title=[];
        res.setEncoding('utf-8');
        //监听data事件，每次取一块数据
        res.on('data',function (chunk) {
            html+=chunk
        })
    });
    //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
    res.on('end',function () {
        var $=cheerio.load(html);
        // 第一个a标签的下一个兄弟元素 获取的内容 然后去除空格
        var time=$('.article-info a:first-child').next().text().trim();
        var news_item={
            //获取文章标题
            title:$('div.article-title a').text().trim(),
        //    获取文章发布时间
            Time:time,
        //   获取供稿单位  attr() 方法也用于设置/改变属性值。设置）链接中 href 属性的值
            link:"http://www.ss.pku.edu.cn"+ $("div.article-title a").attr('href'),
        //    获取供稿单位  a[title=供稿]，表示符合 “a标签下，属性title=供稿的元素
            author:$('a[title=供稿]').text().trim(),
            //i是用来判断获取了多少篇文章
            i:i=i++
        }
    })
}