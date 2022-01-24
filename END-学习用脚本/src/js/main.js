/**
 * 常用JS变量:
 * agentEvent = 代理模式下自动点击模块
 * acEvent= 无障碍模式下自动点击模块
 * device = 设备信息模块
 * file = 文件处理模块
 * http = HTTP网络请求模块
 * shell = shell命令模块
 * thread= 多线程模块
 * image = 图色查找模块
 * utils= 工具类模块
 * global = 全局快捷方式模块
 * 常用java变量：
 *  context : Android的Context对象
 *  javaLoader : java的类加载器对象
 * 导入Java类或者包：
 *  importClass(类名) = 导入java类
 *      例如: importClass(java.io.File) 导入java的 File 类
 *  importPackage(包名) =导入java包名下的所有类
 *      例如: importPackage(java.util) 导入java.util下的类
 *
 */

function main() {
    //开始再这里编写代码了！！
    toast("Hello World");
    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    logd("开始执行脚本...")


    do7();


}

function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

function do1() {
    if (!file.exists("/sdcard/tessdata/eng.traineddata")) {
        loge("copy文件1");
        file.mkdirs("/sdcard/tessdata/")
        if (file.exists("/sdcard/tessdata/")) {
            saveResToFile("eng.traineddata","/sdcard/tessdata/eng.traineddata")
            loge("copy文件1ok");
        }
    }

    if (!file.exists("/sdcard/tessdata/chi_sim.traineddata")) {
        loge("copy文件2");
        if (file.exists("/sdcard/tessdata/")) {
            saveResToFile("chi_sim.traineddata","/sdcard/tessdata/chi_sim.traineddata")
            loge("copy文件2ok");
        }
    }


    //Tesseract模块初始化参数
    let tessInitMap = {
        "type": "tess",
        "language": "chi_sim",
        "debug": false,
        "psm": 1,
        "tessedit_char_blacklist": "",
        "tessedit_char_whitelist": "",
        "save_blob_choices": ""
    }

    let inited = ocr.initOcr(tessInitMap)
    logd("初始化结果 -> " + inited);
    if (!inited) {
        loge("error : " + ocr.getErrorMsg());
        return;
    }else {
        loge("初始化成功");
    }
    var request = image.requestScreenCapture(10000, 0);

    if (!request) {
        request = image.requestScreenCapture(10000, 0);
    }

    sleep(1000)
    //读取一个bitmap
    let bitmap = image.captureScreenBitmap("jpg", 60, 265, 330, 330, 100);
    if (!bitmap) {
        loge("读取图片失败");
        return;
    }else {
        loge("读取图片成功");
    }

    // 对图片进行识别
    let result = ocr.ocrBitmap(bitmap, 20 * 1000, {});
    if (result) {
        logd("ocr结果-》 " + JSON.stringify(result));
        for (var i = 0; i < result.length; i++) {
            var value = result[i];
            logd("文字 : " + value.label + " x: " + value.x + " y: " + value.y + " width: " + value.width + " height: " + value.height);
        }
    } else {
        logw("未识别到结果");
    }

    bitmap.recycle();
    //释放所有资源
    ocr.releaseAll();

}

function do2() {
    // startEnv()

    var request = image.requestScreenCapture(10000, 0);

    if (!request) {
        request = image.requestScreenCapture(10000, 0);
    }
    let baiduOnlineInitMap = {
        "type": "baiduOnline",
        "ak": "xx",
        "sk": "xx"
    }

    let inited = ocr.initOcr(baiduOnlineInitMap)
    logd("初始化结果 -> " + inited);
    if (!inited) {
        loge("error : " + ocr.getErrorMsg());
        return;
    }
    sleep(1000)
    //读取一个bitmap
    let bitmap = image.captureScreenBitmap("jpg", -1, -1, 200, 300, 100);
    if (!bitmap) {
        loge("读取图片失败");
        return;
    }
    // URL 参数参见 ： https://ai.baidu.com/ai-doc/OCR/tk3h7y2aq
    // 对图片进行识别
    let result = ocr.ocrBitmap(bitmap, 20 * 1000, {"url": "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate"});
    if (result) {
        logd("ocr结果-》 " + JSON.stringify(result));
        for (var i = 0; i < result.length; i++) {
            var value = result[i];
            logd("文字 : " + value.label + " x: " + value.x + " y: " + value.y + " width: " + value.width + " height: " + value.height);
        }
    } else {
        logw("未识别到结果 " + ocr.getErrorMsg());
    }

    bitmap.recycle();
    //释放所有资源
    ocr.releaseAll();


}

function do3() {

    logd("isServiceOk " + isServiceOk());
    startEnv()
    logd("isServiceOk " + isServiceOk());

    var request = image.requestScreenCapture(10000, 0);

    if (!request) {
        request = image.requestScreenCapture(10000, 0);
    }
    logd("申请截图结果... " + request)
    if (!request) {
        loge("申请截图权限失败,检查是否开启后台弹出,悬浮框等权限")
        exit()
    }
    //申请完权限至少等1s(垃圾设备多加点)再截图,否则会截不到图
    sleep(1000)
    for (let i = 0; i < 10; i++) {
        var cap = image.captureScreenBitmap("jpg", 100, 100, 200, 300, 100);
        logd("截图数据: " + cap)
        sleep(1000)
        //图片要回收
        image.recycle(cap)
    }
}


function do4(){
    image.initOpenCV();

    // 截图
    var requestImg = image.requestScreenCapture(10000, 0);
    if (!requestImg) {
        requestImg = image.requestScreenCapture(10000, 0);
    }
    if (!requestImg) {
        toast("申请截图权限失败!")
        setCurrentStatus("申请截图权限失败! 请重启无障碍 或者重启手机重试!")
        return false;
    }

    // setCurrentStatus("检测当前页面")
    // 游戏登录页
    let menu = findImage("18+");
    if (menu) {
        // toast("当前在登录界面")
        return ["index"]
    }else {
        logi("未找到");


    }

}

function do5(){
    var selectors= clz("android.widget.TextView").id("tv.danmaku.bili:id/expand_search");
    let click1 = click(selectors);

    if (click1){
        toast("点击成功");
        var selectors1= clz("android.widget.EditText").id("tv.danmaku.bili:id/search_src_text");
        var result = inputText(selectors1,"我是内容");
        if (result){
            toast("是");
        } else {
            toast("否");
        }
    } else {
        toast("点击失败");
    }
}

function do6(){
    var selectors1= clz("android.widget.EditText").id("tv.danmaku.bili:id/search_src_text");
    var result = inputText(selectors1,"我是内容");
    if (result){
        toast("是");
    } else {
        toast("否");
    }
}

function do7(){
    var request = require('request');
    var url = "http://127.0.0.1:20390/agentEvent";
    var params = {
        "type": "enter"
    };
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: params
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        } else {
            console.log(error)
        }
    });

}





/**
 * 自动找图
 * @param name
 * x:left   y:bottom
 * @returns boolean
 */
function findImage(name) {
    let width = device.getScreenWidth();
    let height = device.getScreenHeight();
    //申请完权限等1s再截图,否则会截不到图
    sleep(1000)
    //从工程目录下res文件夹下读取sms.png文件
    var sms = readResAutoImage(name + ".png");
    // 动态获取坐标点
    //在当前屏幕中查找，并且限制只查找一个
    var points = image.findImageEx(sms,0,0,width,height,0.7, 0.9, 21, 5);
    logd("points " + JSON.stringify(points));
    //这玩意是个数组
    if (points) {
        let goods = points[0];
        return {
            "x": goods.left,
            "y": goods.bottom
        };
    }
    return false

}

main();