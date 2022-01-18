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


    do1();


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

function do1(){
    let easyedge = {
        "type": "easyedge",

    }
    let inited = ocr.initOcr(easyedge)
    logd("初始化结果 -> " + inited);
    if (!inited) {
        loge("error : " + ocr.getErrorMsg());
        return;
    }

    let initServer = ocr.initOcrServer(5 * 1000);
    logd("initServer " + initServer);
    if (!initServer) {
        loge("initServer error : " + ocr.getErrorMsg());
        return;
    }
    ocr.setDaemonServer(true,500);
    for (var ix = 0; ix < 20; ix++) {

        //读取一个bitmap
        let bitmap = image.captureScreenBitmap("jpg",300,300,600,600,90);
        if (!bitmap) {
            loge("读取图片失败");
            continue;
        }
        console.time("1")
        logd("start---ocr");
        // 对图片进行识别
        let result = ocr.ocrBitmap(bitmap, 20 * 1000, {});
        logd(result)
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
        logd("耗时: " + console.timeEnd(1) + " ms")
        sleep(1000);
        logd("ix = "+ix)
    }
    //释放所有资源
    ocr.releaseAll();

}

main();