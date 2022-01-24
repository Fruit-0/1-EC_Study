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
    findPicture()
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

function findPicture(){
    var request = image.requestScreenCapture(10000,0);
    if (request){
        toast("申请成功");
    }else {
        toast("申请失败");
        exit();
    }
    var  d= image.initOpenCV();
    logd(d)
    //申请完权限至少等1s(垃圾设备多加点)再截图,否则会截不到图
    sleep(1000)
    //从工程目录下res文件夹下读取sms.png文件
    var sms=readResAutoImage("3.png");
    //在当前屏幕中查找，并且限制只查找一个
    var points = image.findImageEx(sms,0,0,0,0,0.7, 0.9, 21, 5);
    logd("points " + JSON.stringify(points));
//这玩意是个数组
//     if(points && points.length > 0){
//         for(let i=0;i<points.length;i++){
//             logd(points[i])
//             let x = parseInt((points[i].left + points[i].right)/2)
//             let y = parseInt((points[i].top + points[i].bottom)/2)
//             //点击坐标
//             clickPoint(x,y)
//         }
//     }
    //图片要回收
    image.recycle(sms)


}



main();