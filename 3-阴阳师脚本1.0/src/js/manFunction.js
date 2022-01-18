importClass(android.os.PowerManager)
importClass(android.content.Intent);
importClass(android.net.Uri)
importClass(android.os.PowerManager)
importPackage(android.widget)
importPackage(android.graphics)

/**
 * 当前悬浮窗tag
 * @type {string}
 */
let tag = "1";

/**
 * 当前程序运行状态
 * 防止识别到页面识别错误的卡死
 * @type {number}
 */
const runStatus = {
    "pageTest": 0, // 页面检测数
    "successNum": 0, // 采集成功数
}

/**
 * 进入游戏时候返回初始点
 * 用于判断卡死关闭
 * @type {boolean}
 */
let isInit = false;

/**
 * 判断未知原因卡死页面数
 * @type {number}
 */
let notDetectedPage = 0;






function doMain(){

    toast("正常打开了脚本");

    // 监听停止
    stopCallback()

    // 关闭日志
    closeLogWindow();




    //请求权限
    applyAuth()


    // 开启后台运行
    device.keepAwake(PowerManager.SCREEN_DIM_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP);


    // 监测音量上键停止脚本
    thread.execAsync(function () {
        //监听无障碍节点事件
        observeEvent("key-down", function (key, data) {
            // 检查是否点击音量上
            const event = JSON.parse(data)
            if (event.keyCode === 24) {
                exit();
            }
        });
        while (true) {
            sleep(1000)
        }
    });


    openApp();
    // clossApp()


    // 程序运行主逻辑
    runMain()
}

/**
 * 程序运行主逻辑
 */
function runMain() {

    // 基础检查
    if (!check()) {
        return;
    }else {
        toast("检查通过");
    }

    // 检测页面
    let page = testIngPage();// index
    logd(page)
    // 初始化未检测到的页面数
    if (page[0] !== "0") {
        notDetectedPage = 0;
    }

}



function testIngPage() {
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


/**
 * 基础检查
 * @returns {boolean}
 */
function check() {
    // 检查电量
    isQe()
    // 检查时间段
    if (isGetDATE()) {
        toast("不在运行时间段暂停1分钟")
        sleep(60000)
        return false;
    }
    // 判断未知原因卡死
    let noteMax = Number(readConfigString("noteMax"))
    if (!noteMax || noteMax == 0) {
        noteMax = random(10, 15)
    }
    if (notDetectedPage > noteMax) {// 未知的页面大于5
        notDetectedPage = 0;
        clossAppReOpen()
    }
    // 防止识别到页面, 但是识别错误导致的卡死
    // 页面检测成功5次, 采集成功小于4次
    let pageTestMax = Number(readConfigString("pageTestMax"))
    if (!pageTestMax || pageTestMax == 0) {
        pageTestMax = random(9, 12)
    }
    if (runStatus["pageTest"] > pageTestMax && runStatus["successNum"] < 4) {
        // init
        runStatus["pageTest"] = 0;
        runStatus["successNum"] = 0;
        clossAppReOpen()
    }
    return true
}

/**
 * 判断当前时间是否执行
 * return 当前时间段user
 */
function isGetDATE() {

    // 判断当前时间段
    const nowHours = timeFormat("HH");
    // 拿出对应时间段账号密码
    let date = {
        "startTime": readConfigString("startTime"),
        "endTime": readConfigString("endTime"),
    }
    if (parseInt(nowHours) >= parseInt(date.startTime) && parseInt(nowHours) < parseInt(date.endTime)) {
        return true
    }
    return false
}

/**
 * 判断电量是否达到设置
 * 没达到 暂停脚本冲电
 */
function isQe() {
    // 判断当前电量
    let qe = device.getBattery();
    // 拿到脚本设置电量
    const endQe = Number(readConfigString("endQe"))
    const startQe = Number(readConfigString("startQe"))
    let i = 0;
    if (qe < endQe) {
        // 关闭App等待
        clossApp()
        // 暂停充电
        device.keepScreenDim();
        while (i == 0) {
            toast("电量不足暂停10分钟")
            sleep(600000)
            let qe1 = device.getBattery();
            if (qe1 > startQe) {
                i = 1;
            }
        }
    }

}

/**
 * 关闭app重新打开
 */
function clossAppReOpen() {
    clossApp()
    // 默认执行
    openApp();
    // 重新进入以后直接执行返回中枢
    isInit = true
}

/**
 * 打开app
 * @param user
 */
function openApp() {
    setCurrentStatus("正在打开应用")
    // 打开app
    let isOpen = utils.openApp("com.netease.onmyoji.bili");
    let isOpen2 = utils.openAppByName("阴阳师");
    sleep(1000)
    if (!isOpen || !isOpen2) {
        toast("打开失败,正在重试")
        utils.openApp("com.netease.onmyoji.bili");
        utils.openAppByName("阴阳师");
        sleep(1000)
    }
    toast("等待8秒")
    sleep(8000);
}
/**
 * 设置当前悬浮窗信息
 * @param currentStatus
 */
function setCurrentStatus(msg) {
    // 获取屏幕高度宽度
    let width = device.getScreenWidth();
    let height = device.getScreenHeight();
    let tv = new TextView(context);
    floaty.close(tag)
    // 停止关闭
    if (msg === "脚本停止") {
        return
    }
    let str = "";
    // 当前不存在账号
    str += "状态:" + msg
    tv.setText(str);
    tv.setBackgroundColor(Color.parseColor("#fdfff0"))
    floaty.showFloatView(tag, tv, width / 2, height - height / 10);
}


/**
 * 关闭app
 */
function clossApp() {
    // 打开详情页面
    utils.openActivity({
        "action": "android.settings.APPLICATION_DETAILS_SETTINGS",
        "uri": "package:" + "com.netease.onmyoji.bili"
    });
    sleep(2000)
    var selector = textMatch("强行停止");
    click(selector);
    sleep(2000)
    //获取选择器对象
    var selector = id("android:id/button1");
    var result = click(selector);
    if (result) {
        toast("点击成功");
        home();
    } else {
        toast("点击失败");
    }
    
    
    // var selector = textMatch("强行停止");
    // click(selector);
    // var selector2 = textMatch(".*确定.*");
    // var result2 = click(selector2);
    // if (result2) {
    //     toast("关闭成功");
    // }
    // sleep(3000)
}

/**
 * 申请权限
 */
function applyAuth() {
    //暂时先关闭ocr文字识别
    // let paddleocr = {
    //     "type": "paddleocr"
    // }
    // let inited = ocr.initOcr(paddleocr)
    // logd("初始化结果 -> " + inited);
    // if (!inited) {
    //     loge("error : " + ocr.getErrorMsg());
    //     return;
    // }

    // let initServer = ocr.initOcrServer(5 * 1000);
    // logd("initServer " + initServer);
    // if (!initServer) {
    //     loge("initServer error : " + ocr.getErrorMsg());
    //     return;
    // }
    // 浮窗
    let p = floaty.requestFloatViewPermission(1000)
    if (!p) {
        toast("没有浮窗权限，终止执行");
        return false;
    }
    // 无障碍
    var result = isAccMode();
    if (!result) {
        toast("请开启无障碍服务")
        utils.openIntentAction("android.settings.ACCESSIBILITY_SETTINGS");
        return false;
    }
    var result2=  startEnv();
    if (!result2) {
        toast("请开启无障碍服务")
        utils.openIntentAction("android.settings.ACCESSIBILITY_SETTINGS");
        return false;
    }
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
    return true;
}


/**
 * 监听停止
 */
function stopCallback() {
    setStopCallback(function () {
        //震动一秒钟
        device.vibrate(1000);
        //关闭tag=123的浮窗
        // floaty.close(tag)
        setCurrentStatus("脚本停止")
        device.cancelKeepingAwake();
        // 关闭自动化
        closeEnv(false);
        //释放所有资源
        ocr.releaseAll();
    });
}