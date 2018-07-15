var http=require('http'); // Node.js提供了http模块，用于搭建HTTP服务端和客户端
const cheerio=require('cheerio');//中间件  格式化dom
var  url='http://www.runoob.com/nodejs/nodejs-tutorial.html';//目标网址
var courseData ;
http.get(url,function (res) { //以get方式发送请求
    var _html='';
    res.on('data',function (data) {//监听data
        _html+=data;//字符串拼接
    })
    res.on('end',function () {//监听结束
        console.log(_html)
        courseData = filterChapters(_html)
    })
}).on('error',function () {
    console.log('获取资源出错')
});
function filterChapters(html) {
    var $ = cheerio.load(html)
    var chapters = $('.course-wrap')  //在html里寻找我们需要的资源的class
    var courseData = [] // 创建一个数组，用来保存我们的资源
    chapters.each(function(item) {  //遍历我们的html文档
        var chapter = $(this)
        var chapterTitle = chapter.find('h3').text().replace(/\s/g, "")
        var videos = chapter.find('.video').children('li')  //使用childern去获取下个节点
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        videos.each(function(item) {  //遍历视频中的资源，title，id， url
            var video  = $(this).find('.J-media-item') //同样的方式找到我们需要的class部分
            var videoTitle = video.text().replace(/\n/g, "").replace(/\s/g, "");
            var id = video.attr('href').split('video/')[1]; //切割我们的href的到我们的id
            var url = `http://www.imooc.com/video/${id}` // es6字符串模板的方式去通过id拿到我们的视频url
            chapterData.videos.push({
                title:videoTitle,
                id: id,
                url: url
            })
        })
        courseData.push(chapterData)
    })
    return courseData //返回我们需要的资源
}

var courseData = filterChapters(_html)
let content = courseData.map((o) => {
    return JSON.stringify(o) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
})

fs.writeFile('./index.json',content, function(err){ //文件路经，写入的内容，回调函数
    if(err) throw new Error ('写文件失败'+err);
    console.log("成功写入文件")
})
