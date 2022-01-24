/**
 * @author Mr_老冷 QQ:1920712147
 * @date 20210807
 */
/**
 * @author Mr_老冷 QQ:1920712147
 * @description laoleng类
 */
let g_ret = null
const laoleng = {
    app: {},
    arr: {},
    String: {},
    RndStr: {},
    /**
     *@description 键盘功能
     */
    Key: {},
};
logw("laoleng.js插件加载成功,EC教学咨询,Mr_老冷QQ:1920712147")
logw("laoleng.js配套文档http://home.laoleng.top:3001/web/#/9?page_id=167");
laoleng.getVersion = function () {
    return "1.0.4"
}

/**
 * @author Mr_老冷 QQ:1920712147
 * @description 查找节点并点击
 * @param {S} selector 选择器
 * @param {Boolean?} isClick 是否点击
 * @param {Boolean?} pointer 是否指针点击
 * @return {Boolean} true/false;全局jsonObj  g_ret;
 * @example
 * findNode(text("aaa").id("bbb"),true)
 */
function findNode(selector, isClick, pointer) {
    if (typeOf(selector) !== "S") {
        logw("防SB提示,findNode,传参类型不对:" + selector)
        return false;
    }
    g_ret = selector.getOneNodeInfo(0);
    if (g_ret) {
        if (isClick) {
            if (pointer) {
                g_ret.click();
                sleep(random(500, 1000));
            } else {
                findClickEx(g_ret)
            }
        }
        return true;
    }
    return false;
}

/**
 * @author Mr_老冷 QQ:1920712147
 * @description 查找可用父点击节点并无指针点击
 * @param {NodeInfo?} node 全局node返回值
 * @param {Boolean?} isNoClick 是否不点击
 * @return {Boolean} true/false;
 * @example
 * findClickEx(g_ret)
 */
function findClickEx(node, isNoClick) {
    let tmp_ret = false
    node = node || g_ret
    if (typeOf(node) !== "NodeInfo") {
        logw("防SB提示,findClickEx,传参类型不对:" + node)
        return false;
    }
    //4次找不到就算了
    try {
        for (let i = 0; i <= 3; i++) {
            if (!node) return false
            if (node.clickable) {
                tmp_ret = !isNoClick ? node.clickEx() : node
                !isNoClick && sleep(random(500, 1000));
                return tmp_ret
            }
            node = node.parent()
        }
    } catch (e) {
        loge(e);
    }
    return false
}


/**
 * @description 查找可用父滚动节点并滚动
 * @param {NodeInfo?} node 全局node返回值
 * @param {Boolean?} isNoScroll 是否不滚动
 * @return {Boolean} true/false;
 * @example
 */
function findScrollableP(node, isNoScroll) {
    let tmp_ret = false
    node = node || g_ret
    if (typeOf(node) !== "NodeInfo") {
        logw("防SB提示,findClickEx,传参类型不对:" + node)
        return false;
    }
    //11次找不到就算了
    try {
        for (let i = 0; i <= 10; i++) {
            if (!node) return false
            if (node.scrollable) {
                tmp_ret = !isNoScroll ? node.scrollForward() : node
                !isNoScroll && sleep(random(500, 1000));
                return tmp_ret
            }
            node = node.parent()
        }
    } catch (e) {
        loge(e);
    }
    return false
}

/**
 * @description 获取节点x中心点
 * @param node {NodeInfo?} 节点对象
 * @returns {number}
 */
function centerX(node) {
    node = node || g_ret
    return (node.bounds.left + node.bounds.right) / 2
}

/**
 * @description 获取节点y中心点
 * @param node {NodeInfo?}节点对象
 * @returns {number}
 */
function centerY(node) {
    node = node || g_ret
    return (node.bounds.top + node.bounds.bottom) / 2
}

/**
 * @description 在节点一半的范围内随机按压
 * @param node {NodeInfo?} 节点对象
 * @param timeMin {number?} 最小时长,默认1s
 * @param timeMax {number?} 最大时长,默认同最小
 */
function pressHalf(node, timeMin, timeMax) {
    node = node || g_ret
    timeMin = timeMin * 1000 || 1000
    timeMax = timeMax * 1000 || timeMin
    let x1 = ~~((node.bounds.right - node.bounds.left) / 4 + node.bounds.left)
    let y1 = ~~((node.bounds.bottom - node.bounds.top) / 4 + node.bounds.top)
    let x2 = ~~((node.bounds.right - node.bounds.left) / 4 * 3 + node.bounds.left)
    let y2 = ~~((node.bounds.bottom - node.bounds.top) / 4 * 3 + node.bounds.top)
    return press(random(x1, x2), random(y1, y2), random(timeMin, timeMax))
}

/**
 * @description 判断数据类型
 * @param arg{any}
 * @return {string|null|undefined}
 */
function typeOf(arg) {
    if (arg === null) return null;
    if (arg === undefined) return undefined;
    return arg.constructor.name;
}

/**
 * @description 判断数组是否不为空
 * @param arr {Array} 数组
 * @return {boolean}
 */
function isNotEmptyArray(arr) {
    if (!arr) return false;
    return arr.length !== 0;
}

/**
 * @description getRunningPkg替代
 * @return {null|*|string}
 */
function getRunningPkgEx() {
    let node = bounds(100, 200, device.getScreenWidth(), device.getScreenHeight() - 100).getOneNodeInfo(0)
    return node ? node.pkg : ""
}


/**
 * @description 返回并等待
 * @param times {number?} 返回次数,默认1次
 * @param delay {number?} 延迟毫秒数,默认1000
 */
function backs(times, delay) {
    times = times || 1
    delay = delay || 1000
    for (let i = 0; i < times; i++) {
        back()
        sleep(delay)
    }
}

/**
 * @description 返回桌面并等待
 * @param times{number?} 等待秒数
 */
function homes(times) {
    times = times * 1000 || 1000
    home()
    sleep(times)
}

/**
 * @description 随机点击节点
 * @param nodeInfo {NodeInfo?}节点信息,默认g_ret
 * @param noDelay {boolean?}不加延迟,默认false,加延迟
 */
function clickPointBounds(nodeInfo, noDelay) {
    nodeInfo = nodeInfo || g_ret
    clickPoint(random(nodeInfo.bounds.left + 2, nodeInfo.bounds.right - 2), random(nodeInfo.bounds.top + 2, nodeInfo.bounds.bottom - 2))
    if (!noDelay) {
        sleep(random(500, 1000))
    }
}

/**
 * @description 随机点击范围
 * @param x1 {number}
 * @param y1{number}
 * @param x2{number}
 * @param y2{number}
 * @param noDelay {boolean?}不加延迟,默认false,加延迟
 */
function clickPointRnd(x1, y1, x2, y2, noDelay) {
    clickPoint(random(x1, x2), random(y1, y2))
    if (!noDelay) {
        sleep(random(500, 1000))
    }
}

/**
 * @description 随机点击数组
 * @param arr1 {Array} bounds左上坐标 [12,2224]
 * @param arr2{Array} bounds右下坐标 [195,2340]
 * @param noDelay {boolean?}不加延迟,默认false,加延迟
 */
function clickPointArr(arr1, arr2, noDelay) {
    clickPoint(random(arr1[0], arr2[0]), random(arr1[1], arr2[1]))
    if (!noDelay) {
        sleep(random(500, 1000))
    }
}

/**
 * @description 多点比色 配合德林取色
 * @param points {string}
 * @param threshold {floaty?} 0.0 ~ 1.0
 * @returns {boolean} true/false
 */
function cmpColor(points, threshold) {
    threshold = threshold || 1.0
    return image.cmpColorEx(points, threshold, 0, 0, 0, 0)
}

/**
 * @description multitouch方法进行点击
 * @param node {NodeInfo?} 节点信息,默认g_ret
 */
function tapExR(node) {
    node = node || g_ret
    let x = random(node.bounds.left, node.bounds.right)
    let y = random(node.bounds.top, node.bounds.bottom)
    let touch1 = MultiPoint
        .get()
        .action(0).x(x).y(y).pointer(1).delay(1)
        .next()
        .action(2).x(x).y(y).pointer(1).delay(1)
        .next()
        .action(1).x(x).y(y).pointer(1).delay(1);

    multiTouch(touch1, null, null, 300);
}


laoleng.app = {};
/**
 * @description 打开app设置页
 * @param {String} pkgName 包名
 * @return {Boolean} true/false
 */
laoleng.app.openAppSetting = function (pkgName) {
    return utils.openActivity({
        "action": "android.settings.APPLICATION_DETAILS_SETTINGS",
        "uri": "package:" + pkgName
    });
}
/**
 * @description shell强制关闭app
 * @param {String} pkgName 包名
 * @return {Boolean} true/false
 */
laoleng.app.forceKillApp = function (pkgName) {
    return !!shell.execCommand("am force-stop " + pkgName)
}
/**
 * @description shell清理app数据
 * @param {String} pkgName 包名
 * @return {Boolean} true/false
 */
laoleng.app.cleanApp = function (pkgName) {
    shell.execCommand("pm clear  " + pkgName)
}
/**
 * @description 包名是否在前台
 * @param pkgName{string} 包名
 * @return {boolean} true/false
 */
laoleng.app.isRunningPkg = function (pkgName) {
    return !!pkg(pkgName).getOneNodeInfo(0)
}

/**
 * @description 无障碍关闭app数据[华为/小米]
 * @param {String} pkgName 包名
 * @return {Boolean} true/false
 */
laoleng.app.accKillApp = function (pkgName) {
    logi(">>accKillApp")
    homes();
    this.openAppSetting(pkgName);
    sleep(1000);
    let timeOut = 0
    while (true) {
        if (findNode(textMatch("^强行停止$|^强行结束$|^结束运行$"))) {
            logd("强行停止");
            if (g_ret.enabled) {
                findClickEx()
                timeOut++;
                if (timeOut >= 5) {
                    backs();
                    return false
                }
            } else {
                backs();
                return true
            }
        } else if (findNode(text("确定"), true)) {
            logd("确定");
        } else if (findNode(desc("打开设置。").pkg("com.android.systemui"))) {
            logd("打开了设置框");
            backs();
        }
    }
}
/**
 * @description 获取apk图标bitmap
 * @param pkgName {string} apk包名
 * @return {ImageBitmap}  图标bitmap
 */
laoleng.app.getBitmap = function (pkgName) {
    let packageManager, applicationInfo;
    try {
        packageManager = context.getApplicationContext().getPackageManager();
        applicationInfo = packageManager.getApplicationInfo(pkgName, 0);
    } catch (e) {
        return null;
    }
    return packageManager.getApplicationIcon(applicationInfo).getBitmap();
}
/**
 * @description 数组方法
 * @type {{}}
 */
laoleng.arr = {}
/**
 * @description 数组去重,函数方法
 * @param arr {any[]} 待去重数组
 * @return {any[]} 去重后数组
 */
laoleng.arr.unique = function (arr) {
    return Array.from(new Set(arr))
}
/**
 * @description 数组去重,原型方法
 */
Array.prototype.unique = function () {
    let tmpS = new Set(this), i = 0
    for (let tmp of tmpS) {
        this[i] = tmp
        i++
    }
    this.length = i
}

laoleng.Alert = {}
/**
 * @description 暂停脚本并弹窗提示
 * @param title {string} 标题
 * @param msg {string?}  内容 可空,默认标题
 * @return {boolean} 选择了是/否
 */
laoleng.Alert.dialog = function (title, msg) {
    msg = msg || title
    let p = {
        "title": title,
        "msg": msg,
        "cancelable": false,
        "cancelText": "否",
        "okText": "是"
    };
    let a = 0
    ui.alert(p,
        function (dialog) {
            //让对话消失掉
            dialog.doDismiss();
            a = 1
            return true;
        },
        function (dialog) {
            //让对话消失掉
            dialog.doDismiss();
            a = 2
            return true;
        },
        function () {
            return true;
        });
    while (a === 0) {
        sleep(200)
    }
    return a === 1
}
/**
 *@description 暂停脚本并弹窗等待输入
 * @param title{string}  标题
 * @param msg {string}?  内容 可空,默认标题
 * @return {string} 输入的内容
 */
laoleng.Alert.input = function (title, msg) {
    msg = msg || title
    let p = {
        "title": title,
        "msg": msg,
        "cancelable": false,
        "cancelText": "否",
        "okText": "是"
    };
    let text_ret = ""
    let a = 0
    ui.inputDialog(p,
        function (dialog, v, text) {
            //让对话消失掉
            dialog.doDismiss();
            a = 1
            text_ret = text
            return true;
        },
        function (dialog) {
            //让对话消失掉
            dialog.doDismiss();
            a = 2
            return true;
        },
        function () {
            a = 2
            return true;
        });
    while (a === 0) {
        sleep(200)
    }
    return text_ret
}

laoleng.Bytes = {}
/**
 * @description base64解密,返回bytes
 * @param {String} str "YWJj"
 * @return {bytes[]} bytes
 */
laoleng.Bytes.base64Decode = function (str) {
    importClass(android.util.Base64)
    return Base64.decode(str, Base64.DEFAULT)
}
/**
 * @description 对bytes进行base64加密,返回base64结果
 * @param {bytes[]} bytes [B@8a3bd58 待加密的字节集
 * @return {String} base64编码文字 "YWJj"
 */
laoleng.Bytes.base64Encode = function (bytes) {
    importClass(android.util.Base64)
    return Base64.encodeToString(bytes, Base64.DEFAULT);
}
/**
 * @description 创建空的bytes字节数组
 * @param {number} length 数组长度,默认10
 * @return {bytes[]} 空的bytes字节数组
 */
laoleng.Bytes.createBytes = function (length) {
    length = length || 10
    if (length > 127) length = 127
    let bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = i;
    }
    return bytes
}


/**
 * @description Date 时间类
 * Format 时间格式化
 * getTimeStamp 获取时间戳
 */
laoleng.Date = {}

/**
 * @description Format 为Date时间类加入格式化功能
 * @param {string?} fmt 时间格式 默认 yyyy/MM/dd HH:mm:ss
 * @return {string} 格式化后的时间
 */
Date.prototype.Format = function (fmt) {
    fmt = fmt || "yyyy/MM/dd hh:mm:ss"
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * @description getTimeStamp 获取时间戳
 * @param {String?} time 时间/可为空 2020-06-20 16:16:34或 2020/06/20 16:16:34
 * @return {number} 时间戳
 */
laoleng.Date.getTimeStamp = function (time) {
    if (time) {
        return ~~(String((new Date(time.replace(/-/g, '/'))).getTime()).slice(0, -3));
    } else {
        return ~~(String((new Date()).getTime()).slice(0, -3));
    }

}
/**
 * @description 时间戳转时间
 * @param timestamp {number} 时间戳
 * @return {string} 时间
 */
laoleng.Date.timestampToTime = function (timestamp) {
    if ((timestamp + "").length === 10) {
        timestamp = timestamp * 1000
    }
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    //Y + M + D + h + m + s
    return date.getFullYear() + '-'
        + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        + date.getDate() + ' '
        + date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds()
}

/**
 * @description laoleng设备类
 */
laoleng.Device = {};
/**
 * @description 获取设备横竖屏方向
 * @return {Boolean} true 竖屏 false 横屏
 */
laoleng.Device.isRotate = function () {
    return !context.getResources().getConfiguration().orientation === android.content.res.Configuration.ORIENTATION_PORTRAIT
}
/**
 * @description 设备是否是模拟器
 * @return {Boolean} true 模拟器 false 非模拟器
 */
laoleng.Device.isSimulator = function () {
    return android.os.Build.CPU_ABI + "" === "x86"
}
laoleng.EC = {}
/**
 * @description 初始化EC节点服务
 */
laoleng.EC.init = function () {
    for (let i = 0; i < 3; i++) {
        logi("第" + (i + 1) + "次启动服务结果: " + startEnv());
        if (isServiceOk()) {
            daemonEnv(true)
            return true;
        }
    }
    toast("自动化服务启动失败，无法执行脚本");
    loge("自动化服务启动失败，无法执行脚本")
    exit();
}
/**
 * @description 初始化EC图色服务
 * @param {number?} timeout 找图超时,默认1s
 */
laoleng.EC.initImage = function (timeout) {
    timeout = timeout * 1000 || 1000
    image.setInitParam({"action_timeout": timeout})
    let request = image.requestScreenCapture(10000, 0);
    if (!request) {
        request = image.requestScreenCapture(10000, 0);
    }
    logi("申请截图权限结果... " + request)
    if (!request) {
        toast("申请截图权限失败,结束脚本");
        loge("申请截图权限失败,结束脚本");
        exit()
    }
    sleep(1000)
}
/**
 * @description 初始化开发分辨率
 * @param initX {number} 开发设备的宽值
 * @param initY {number} 开发设备的高值
 */
laoleng.EC.initScale = function (initX, initY) {
    if (!initX || !initY) {
        loge("未传入开发分辨率,停止脚本");
        exit()
    }
    this.ratioX = device.getScreenWidth() / initX
    this.ratioY = device.getScreenHeight() / initY
}
/**
 * @ 获取计算后的分辨率
 * @param x {number}x坐标
 * @param y{number} y坐标
 * @return {null|{x: number, y: number}}
 */
laoleng.EC.scale = function (x, y) {
    if (!this.ratioX) {
        loge("未初始化开发分辨率,停止脚本");
        exit()
    }
    if (!x || !y) return null
    return {
        x: ~~(x * this.ratioX),
        y: ~~(y * this.ratioY)
    }
}
laoleng.face = {}
laoleng.face.dy = function () {
    let str = ["[一起加油]", "[戴口罩]", "[勤洗手]", "[iloveyou]", "[巧克力]", "[戒指]", "[微笑]", "[色]", "[酷拽]", "[抠鼻]", "[流泪]",
        "[呲牙]", "[睡]", "[害羞]", "[调皮]", "[晕]", "[衰]", "[闭嘴]", "[机智]", "[赞]", "[鼓掌]", "[感谢]", "[哈欠]", "[大笑]", "[打脸]",
        "[耶]", "[灵机一动]", "[来看我]", "[送心]", "[困]", "[疑问]", "[泣不成声]", "[小鼓掌]", "[大金牙]", "[偷笑]", "[思考]", "[吐血]",
        "[可怜]", "[嘘]", "[撇嘴]", "[坏笑]", "[憨笑]", "[得意]", "[奸笑]", "[笑哭]", "[尴尬]", "[抓狂]", "[泪奔]", "[钱]", "[亲亲]",
        "[恐惧]", "[愉快]", "[快哭了]", "[翻白眼]", "[我想静静]", "[委屈]", "[舔屏]", "[鄙视]", "[不失礼貌的微笑]", "[绝望的凝视]", "[拥抱]",
        "[紫薇别走]", "[再见]", "[飞吻]", "[吐舌]", "[绿帽子]", "[吃瓜群众]", "[不看]",
        "[皱眉]", "[红脸]", "[尬笑]", "[擦汗]", "[强]", "[如花]", "[大哭]", "[加好友]", "[嘿哈]", "[惊恐]", "[囧]", "[难过]", "[斜眼]", "[比心]", "[悠闲]",
        "[阴险]", "[OK]", "[勾引]", "[拳头]", "[胜利]", "[嘴唇]", "[给力]", "[爱心]", "[心碎]", "[玫瑰]", "[18禁]", "[玫瑰]", "[蛋糕]"]
    return str[random(0, 95)]
}


laoleng.files = {};

/**
 * @description 写入文本到文件
 * @param {String} fileName 文件名
 * @param {String} data 写入内容
 * @param {String?} encoding 编码
 * @return {boolean}
 */
laoleng.files.writeFile = function (fileName, data, encoding) {
    importClass(java.io.File)
    importClass(java.io.FileOutputStream)
    try {
        let op = new FileOutputStream(new File(fileName))
        op.write(new java.lang.String(data).getBytes(encoding ? encoding : "utf-8"));
        op.close();
        return true
    } catch (e) {
        loge("writeFile:" + e);
        return false
    }
}

/**
 * @description 写入bytes字节集到文本
 * @param {String} fileName 文件名
 * @param {bytes[]} bytes bytes字节流
 * @param {Boolean?} append 是否追加模式,默认不追加
 * @return {boolean}
 */
laoleng.files.writeFileBytes = function (fileName, bytes, append) {
    importClass(java.io.FileOutputStream);
    importClass(java.io.BufferedOutputStream);
    let out = null;
    append = append || false;//append必须给参数,不然报错
    try {
        out = new BufferedOutputStream(new FileOutputStream(fileName, append));
        out.write(bytes);
        out.close();
        return true
    } catch (e) {
        loge("writeFileBytes" + e);
    } finally {
        if (out != null) {
            out.close();
        }
    }
    return false
}
/**
 * @description 读取文本bytes数据
 * @param {String} fileName 文件名
 * @return {bytes[]} 文本bytes数据
 */
laoleng.files.readFileBytes = function (fileName) {
    importClass(java.io.File)
    importClass(java.io.FileInputStream)
    importClass(java.nio.ByteBuffer)
    importClass(java.nio.channels.FileChannel)
    try {
        let f = new File(fileName);
        let channel, fs;
        fs = new FileInputStream(f);
        channel = fs.getChannel();
        let byteBuffer = ByteBuffer.allocate(channel.size())
        while ((channel.read(byteBuffer)) > 0) {
        }
        fs.close()
        channel.close()
        return byteBuffer.array();
    } catch (e) {
        return null;
    }
}

/**
 * @description 读取文件到Base64数据
 * @param {String} fileName 文件名
 * @return {String} 文件的Base64数据
 */
laoleng.files.readFileBase64 = function (fileName) {
    importClass(Base64)
    return android.util.Base64.encodeToString(this.readFileBytes(fileName), Base64.DEFAULT);
}
/**
 * @description 写入Base64数据到文件
 * @param {String} fileName 文件名
 * @param {String} base64 Base64数据
 * @return {boolean} true/false
 */
laoleng.files.writeFileBase64 = function (fileName, base64) {
    importClass(android.util.Base64)
    return this.writeFileBytes(fileName, Base64.decode(base64, Base64.DEFAULT), false)
}
/**
 * @description 移动或重命名文件
 * @param {String} srcPath 初始文件名
 * @param {String} desPath 目标文件名
 * @return {boolean}true/false
 */
laoleng.files.moveOrRenameFile = function (srcPath, desPath) {
    importClass(java.io.File)
    try {
        new File(srcPath).renameTo(new File(desPath))
        return true
    } catch (e) {
        logd(e);
    }
    return false
}


/**
 * @description laoleng http类
 */
laoleng.http = {};
/**
 * @description httpGet
 * @param {String} url 请求链接
 * @param {Object?} params 请求参数{"a":1}
 * @param {String?} dataType 默认json string/json
 * @param {number?} timeout 请求超时 默认 10秒
 * @param {Object?} headers  UA {"a":1}
 * @return {JSON|null|string}
 */
laoleng.http.get = function (url, params, dataType, timeout, headers) {
    timeout = timeout * 1000 || 10 * 1000
    dataType = dataType || "json"
    let data = http.httpGet(url, params, timeout, headers);
    //logd(data);
    if (data) {
        // if (data === "404 page not found") {
        //     return false
        // }
        switch (dataType) {
            case "string":
                return data;
            case "json":
                try {
                    return JSON.parse(data);
                } catch (e) {
                    loge(e);
                }
                return null;
            default:
                return data;
        }
    }
    return null;
}

/**
 * @description httpPost
 * @param {String} url 请求链接
 * @param {Object?} params 请求参数{"a":1}
 * @param {String?} dataType 默认json string/json
 * @param {number?} timeout 请求超时 默认 10秒
 * @param {Object?} headers 请求头信息 {"a":1}
 * @return {JSON|null|string}
 */
laoleng.http.post = function (url, params, dataType, timeout, headers) {
    timeout = timeout * 1000 || 10 * 1000
    dataType = dataType || "json"
    let data = http.httpPost(url, params, null, timeout, headers);
    // logd(data);
    if (data) {
        // if (data === "404 page not found") {
        //     return false
        // }
        switch (dataType) {
            case "string":
                return data;
            case "json":
                try {
                    return JSON.parse(data);
                } catch (e) {
                    loge(e);
                }
                return null;
            default:
                return data;
        }
    }
    return null;
}
/**
 * @description httpPost
 * @param {String} url 请求链接
 * @param {Object?} params 请求参数json{"a":1}
 * @param {String?} dataType 默认json string/json
 * @param {number?} timeout 请求超时 默认 10秒
 * @param {Object?} header header {"a":1}
 * @return {JSON|null|string}
 */
laoleng.http.postJson = function (url, params, dataType, timeout, header) {
    timeout = timeout * 1000 || 10 * 1000
    dataType = dataType || "json"
    let data = http.postJSON(url, params, timeout, header);
    // logd(data);
    if (data) {
        // if (data === "404 page not found") {
        //     return false
        // }
        switch (dataType) {
            case "string":
                return data;
            case "json":
                try {
                    return JSON.parse(data);
                } catch (e) {
                    loge(e);
                }
                return null;
            default:
                return data;
        }
    }
    return null;
}
/**
 * @description 获取当前IP的地址
 * @return {string}
 */
laoleng.http.getIpLocation = function () {
    let ipUrl = "http://www.baidu.com/s?ie=UTF-8&wd=ip%E5%BD%92%E5%B1%9E%E5%9C%B0%E6%9F%A5%E8%AF%A2";
    let r = this.get(ipUrl, "", "string");
    if (r) {
        r = r.match(/本机IP:&nbsp;\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}<\/span>([\s\S]*?)<\/td/);
        if (r) return r[1].replace(/\s{2,}/, "");
    }
    return "";
}
/**
 * @description 获取网络IP
 * @return {string}
 */
laoleng.http.getNetIp = function () {
    let ipList = [
        "http://ddns.oray.com/checkip",
        "http://pv.sohu.com/cityjson",
    ]
    for (let i = 0; i < ipList.length; i++) {
        let r = this.get(ipList[i], "", "string");
        if (r) {
            r = r.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
            if (r) return r[0]
        }
    }
    return "0.0.0.0";
}
/**
 * @description 获取10位网络时间戳
 * @return {number} 10位网络时间戳
 */
laoleng.http.getNetTimeStamp = function () {
    //k780接口
    let res = this.get("http://api.k780.com/?app=life.time&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json")
    if (res && res.success === "1") {
        return ~~res.result.timestamp
    }
    return 0
}
/**
 * @description 随机UA
 * @return {string}随机UA
 */
laoleng.http.randomUA = function () {
    let user_agent = [
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 OPR/26.0.1656.60",
        "Opera/8.0 (Windows NT 5.1; U; en)",
        "Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.50",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.50",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0",
        "Mozilla/5.0 (X11; U; Linux x86_64; zh-CN; rv:1.9.2.10) Gecko/20100922 Ubuntu/10.10 (maverick) Firefox/3.6.10",
        // Safari
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
        // chrome
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11",
        "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.133 Safari/534.16",
        // 360
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
        // 淘宝浏览器
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/2.0 Safari/536.11",
        // 猎豹浏览器
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER",
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E; LBBROWSER)",
        // QQ浏览器
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)",
        // sogou浏览器
        "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0",
        "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SV1; QQDownload 732; .NET4.0C; .NET4.0E; SE 2.X MetaSr 1.0)",
        // maxthon浏览器
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.3.4000 Chrome/30.0.1599.101 Safari/537.36",
        // UC浏览器
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 UBrowser/4.0.3214.0 Safari/537.36",

        //各种移动端

        // IPhone
        "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
        // IPod
        "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
        // IPAD
        "Mozilla/5.0 (iPad; U; CPU OS 4_2_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
        "Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
        // Android
        "Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
        "Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
        // QQ浏览器 Android版本
        "MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
        // Android Opera Mobile
        "Opera/9.80 (Android 2.3.4; Linux; Opera Mobi/build-1107180945; U; en-GB) Presto/2.8.149 Version/11.10",
        // Android Pad Moto Xoom
        "Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13",
        // BlackBerry
        "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+",
        // WebOS HP Touchpad
        "Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0",
        // Nokia N97
        "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/20.0.019; Profile/MIDP-2.1 Configuration/CLDC-1.1) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.18124",
        // Windows Phone Mango
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)",
        // UC浏览器
        "UCWEB7.0.2.37/28/999",
        "NOKIA5700/ UCWEB7.0.2.37/28/999",
        // UCOpenwave
        "Openwave/ UCWEB7.0.2.37/28/999",
        // UC Opera
        "Mozilla/4.0 (compatible; MSIE 6.0; ) Opera/UCWEB7.0.2.37/28/999",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1",
        "Mozilla/5.0 (X11; CrOS i686 2268.111.0) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6",
        "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1090.0 Safari/536.6",
        "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/19.77.34.5 Safari/537.1",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5",
        "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.36 Safari/536.5",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3",
        "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_0) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3",
        "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1062.0 Safari/536.3",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1062.0 Safari/536.3",
        "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",
        "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.0 Safari/536.3",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24",
        "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24",
        "ApiPOST Runtime +https://www.apipost.cn",
    ]
    return user_agent[random(0, user_agent.length - 1)]
}

/**
 * @description 网站是否可连通
 * @param hostAddress {string?} 网站地址,可空,空则为测试本机网络连通性
 * @return {boolean} true/false
 */
laoleng.http.isConnectAble = function (hostAddress) {
    hostAddress = hostAddress || "www.baidu.com"
    hostAddress = hostAddress.replace(/http:\/\/|https:\/\//g, "")
    return java.lang.Runtime.getRuntime().exec("ping -c 2 " + hostAddress).waitFor() === 0
}
laoleng.intent = {}
/**
 *@description 默认浏览器打开网址
 * @param {string} url 网址链接
 * @return {boolean}
 */
laoleng.intent.openUrl = function (url) {
    utils.openActivity({
        action: "android.intent.action.VIEW",
        uri: url,
    })
}

/**
 * @description 用其他浏览器打开网址,默认via
 * @param url {string}
 * @param pkg {string}
 * @param className {string}
 * @return {boolean}
 */
laoleng.intent.openUrlEx = function (url, pkg, className) {
    pkg = pkg || "mark.via"
    className = className || "mark.via.ui.activity.BrowserActivity"
    return utils.openActivity({
        action: "android.intent.action.VIEW",
        uri: url,
        pkg: pkg,
        className: className
    })
}
/**
 * @description 打开应用设置页
 * @param pkgName {string} 包名
 * @return {boolean}
 */
laoleng.intent.openAppSetting = function (pkgName) {
    importClass(android.content.Intent);
    return utils.openActivity({
        action: "android.settings.APPLICATION_DETAILS_SETTINGS",
        uri: pkgName,
        flag: Intent.FLAG_ACTIVITY_NEW_TASK
    })
}
/**
 * @description intent安装apk,调起安装页面
 * @param path {string} apk安装包路径
 * @return {boolean}
 */
laoleng.intent.installApp = function (path) {
    return utils.openActivity({
        "action": "android.intent.action.VIEW",
        "uri": "file://" + path,
        "type": "application/vnd.android.package-archive"
    })
}
/**
 * @description 打开qq群资料页
 * @param qqGroup {string} QQ群号
 * @return {boolean}
 */
laoleng.intent.openQQGroupCard = function (qqGroup) {
    return utils.openActivity({
        action: "android.intent.action.VIEW",
        uri: "mqqapi://card/show_pslcard?src_type=internal&version=1&uin=" + qqGroup + "&card_type=group&source=qrcode",
        pkg: "com.tencent.mobileqq",
    })
}
/**
 * @description 打开qq聊天页
 * @param QQ {string} QQ号
 * @return {boolean}
 */
laoleng.intent.openQQChat = function (QQ) {
    return utils.openActivity({
        action: "android.intent.action.VIEW",
        uri: "mqq://im/chat?chat_type=wpa&version=1&src_type=web&uin=" + QQ,
        pkg: "com.tencent.mobileqq",
    })
}
/**
 *@description 图库打开图片
 * @param path{string} 图片路径
 * @return {boolean}
 */
laoleng.intent.openPic = function (path) {
    return utils.openActivity({
        action: "android.intent.action.VIEW",
        uri: "file://" + path,
        type: "image/png",
        pkg: "com.android.gallery3d",
        className: "com.android.gallery3d.app.GalleryActivity"
    })

}
/**
 *@description 打开APP的activety页面
 * @param pkgName{string} 包名
 * @param className{string} 类名
 * @return {boolean}
 */
laoleng.intent.openActivity = function (pkgName, className) {
    return utils.openActivity({
        pkg: pkgName,
        className: className
    })

}

laoleng.jsoup = {};
/**
 * @description jsoup.get主要用来下载bytes流
 * @param {String} url 请求链接
 * @param {number?} timeout 超时,默认30s
 * @param {String?} retType 返回值格式 string/byte/json/stream  默认string
 * @return {any}
 */
laoleng.jsoup.get = function (url, timeout, retType) {
    importClass(org.jsoup.Connection);
    importClass(org.jsoup.Jsoup);
    timeout = timeout * 1000 || 30 * 1000
    let filename = null
    let connect = Jsoup.connect(url)
        .ignoreContentType(true)//忽略类型错误
        .ignoreHttpErrors(true)//忽略http错误
        .method(Connection.Method.GET)//访问方式
        .timeout(timeout)
        .maxBodySize(0)//防止下载数据丢失
        .execute()
    if (connect.header("Content-Disposition")) {
        filename = connect.header("Content-Disposition").split("=")[1]
    }
    switch (retType) {
        case "string":
            return connect.body();
        case "byte":
            return {
                bytes: connect.bodyAsBytes(),
                filename: filename
            };
        case "json":
            return JSON.parse(connect.body());
        case "stream":
            return connect.bodyStream();
        default:
            return connect.body();
    }
}
/**
 * @description jsoup.post主要用来直接请求data数据
 * @param {String} url 请求链接
 * @param {string} data 请求数据
 * @param {number?} timeout 超时,默认30s
 * @param {String?} retType 返回值格式 string/byte/json/stream  默认string
 * @return {any}
 */
laoleng.jsoup.post = function (url, data, timeout, retType) {
    importClass(org.jsoup.Connection);
    importClass(org.jsoup.Jsoup);
    timeout = timeout * 1000 || 30 * 1000
    let filename = null
    let connect = Jsoup.connect(url)
        .ignoreContentType(true)//忽略类型错误
        .ignoreHttpErrors(true)//忽略http错误
        .method(Connection.Method.POST)//访问方式
        .timeout(timeout)
        .requestBody(data)
        .maxBodySize(0)//防止下载数据丢失
        .execute()
    switch (retType) {
        case "string":
            return connect.body();
        case "byte":
            return connect.bodyAsBytes()
        case "json":
            return JSON.parse(connect.body());
        case "stream":
            return connect.bodyStream();
        default:
            return connect.body();
    }
}

laoleng.Rnd = {};
/**
 * @description 计算数学几率
 * @param odds {number} 几率
 * @return {boolean} true/false
 */
laoleng.Rnd.odds = function (odds) {
    return random(1, 100) <= Number(odds);
}
/**
 * @description 延迟随机时间并提示
 * @param {number} startTime 起始时长,毫秒
 * @param {number}endTime 结束时长,毫秒
 * @param {string?}msg 提示信息
 */
laoleng.Rnd.sleep = function (startTime, endTime, msg) {
    endTime = endTime || startTime
    let tmp, tmp_int
    tmp = random(~~(startTime), ~~(endTime));
    tmp_int = ~~(tmp / 1000);

    if (msg) {
        logd(msg + "倒计时:" + tmp_int + "秒");
        toast(msg + "倒计时:" + tmp_int + "秒")
    }
    for (let d = tmp_int; d >= 0; d--) {
        sleep(1000);
    }
    sleep(tmp - tmp_int * 1000);
}
/**
 * @description laoleng随机字符串功能类
 */
laoleng.RndStr = {};
/**
 * @description 随机_大写字母
 * @param {number?} count 随机个数,默认1个
 * @return {String} 随机结果
 */
laoleng.RndStr.upperCase = function (count) {
    count = count || 1
    let text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ret = '';
    for (let i = 0, len = text.length - 1; i < count; i++) {
        ret += text[random(0, len)];
    }
    return ret;
}
/**
 * @description 随机_小写字母
 * @param {number?} count 随机个数,默认1个
 * @return {String} 随机结果
 */
laoleng.RndStr.lowerCase = function (count) {
    count = count || 1
    let text = 'abcdefghijklmnopqrstuvwxyz', ret = '';
    for (let i = 0, len = text.length - 1; i < count; i++) {
        ret += text[random(0, len)];
    }
    return ret;
}
/**
 * @description 随机_字母
 * @param {number?} count 随机个数,默认1个
 * @return {String} 随机结果
 */
laoleng.RndStr.cases = function (count) {
    count = count || 1
    let text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', ret = '';
    for (let i = 0, len = text.length - 1; i < count; i++) {
        ret += text[random(0, len)];
    }
    return ret;
}
/**
 * @description 随机_数字字符串
 * @param {number?} count 随机个数,默认1个
 * @return {String} 随机结果
 */
laoleng.RndStr.numStr = function (count) {
    count = count || 1
    let text = '0123456789', ret = '';
    for (let i = 0, len = text.length - 1; i < count; i++) {
        ret += text[random(0, len)];
    }
    return ret;
}
/**
 * @description 随机_小写字母,数字
 * @param {number?} count 随机个数,默认1个
 * @return {String} 随机结果
 */
laoleng.RndStr.lowerCaseAndNum = function (count) {
    count = count || 1
    let text = 'abcdefghijklmnopqrstuvwxyz0123456789', ret = '';
    for (let i = 0, len = text.length - 1; i < count; i++) {
        ret += text[random(0, len)];
    }
    return ret;
}
/**
 * @description 随机_大小写字母,数字,符号
 * @param {number?} count 随机个数,默认1个
 * @return {String} 随机结果
 */
laoleng.RndStr.caseAndNum = function (count) {
    count = count || 1
    let text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=-@#~,.[]()!%^*$', ret = '';
    for (let i = 0, len = text.length - 1; i < count; i++) {
        ret += text[random(0, len)];
    }
    return ret;
}
/**
 * @description 随机_全部中文
 * @param {number?} count 随机个数,默认1个
 * @return {String} 随机结果
 */
laoleng.RndStr.chineseAll = function (count) {
    count = count || 1
    let ret = "";
    for (let i = 0; i < count; i++) {
        ret += String.fromCharCode(random(19968, 26032));
    }
    return ret;
}
/**
 * @description 随机_手机号
 * @return {String} 随机_手机号
 */
laoleng.RndStr.getMobile = function () {
    let start = ["130", "131", "132", "133", "134", "135", "137", "138",
        "170", "187", "189", "199", "198", "156", "166", "175", "186", "184", "146", "139", "147",
        "150", "151", "152", "157", "158", "159", "178", "182", "183", "187", "188", "133", "153",
        "149", "173", "177", "180", "181", "189"]
    return start[random(0, start.length - 1)] + this.numStr(8)
}
/**
 * @description 随机_名字
 * @param {string?} gender 性别,可空 男,女,全部随机
 * @return {String} 随机_手机号
 */
laoleng.RndStr.getName = function (gender) {
    //以下字库可自行添加
    let familyNames = [
        "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "楮", "卫", "蒋", "沈", "韩", "杨",
        "朱", "秦", "尤", "许", "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜",
        "戚", "谢", "邹", "喻", "柏", "水", "窦", "章", "云", "苏", "潘", "葛", "奚", "范", "彭", "郎",
        "鲁", "韦", "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳", "酆", "鲍", "史", "唐",
        "费", "廉", "岑", "薛", "雷", "贺", "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余", "元", "卜", "顾", "孟", "平", "黄",
        "和", "穆", "萧", "尹", "姚", "邵", "湛", "汪", "祁", "毛", "禹", "狄", "米", "贝", "明", "臧",
        "计", "伏", "成", "戴", "谈", "宋", "茅", "庞", "熊", "纪", "舒", "屈", "项", "祝", "董", "梁",
        "杜", "阮", "蓝", "闽", "席", "季", "麻", "强", "贾", "路", "娄", "危", "江", "童", "颜", "郭",
        "梅", "盛", "林", "刁", "锺", "徐", "丘", "骆", "高", "夏", "蔡", "田", "樊", "胡", "凌", "霍",
        "虞", "万", "支", "柯", "昝", "管", "卢", "莫", "经", "房", "裘", "缪", "干", "解", "应", "宗",
        "丁", "宣", "贲", "邓", "郁", "单", "杭", "洪", "包", "诸", "左", "石", "崔", "吉", "钮", "龚",
        "程", "嵇", "邢", "滑", "裴", "陆", "荣", "翁", "荀", "羊", "於", "惠", "甄", "麹", "家", "封",
        "芮", "羿", "储", "靳", "汲", "邴", "糜", "松", "井", "段", "富", "巫", "乌", "焦", "巴", "弓",
        "牧", "隗", "山", "谷", "车", "侯", "宓", "蓬", "全", "郗", "班", "仰", "秋", "仲", "伊", "宫",
        "宁", "仇", "栾", "暴", "甘", "斜", "厉", "戎", "祖", "武", "符", "刘", "景", "詹", "束", "龙",
        "叶", "幸", "司", "韶", "郜", "黎", "蓟", "薄", "印", "宿", "白", "怀", "蒲", "邰", "从", "鄂",
        "索", "咸", "籍", "赖", "卓", "蔺", "屠", "蒙", "池", "乔", "阴", "郁", "胥", "能", "苍", "双",
        "闻", "莘", "党", "翟", "谭", "贡", "劳", "逄", "姬", "申", "扶", "堵", "冉", "宰", "郦", "雍",
        "郤", "璩", "桑", "桂", "濮", "牛", "寿", "通", "边", "扈", "燕", "冀", "郏", "浦", "尚", "农",
        "温", "别", "庄", "晏", "柴", "瞿", "阎", "充", "慕", "连", "茹", "习", "宦", "艾", "鱼", "容",
        "向", "古", "易", "慎", "戈", "廖", "庾", "终", "暨", "居", "衡", "步", "都", "耿", "满", "弘",
        "匡", "国", "文", "寇", "广", "禄", "阙", "东", "欧", "殳", "沃", "利", "蔚", "越", "夔", "隆",
        "师", "巩", "厍", "聂", "晁", "勾", "敖", "融", "冷", "訾", "辛", "阚", "那", "简", "饶", "空",
        "曾", "毋", "沙", "乜", "养", "鞠", "须", "丰", "巢", "关", "蒯", "相", "查", "后", "荆", "红",
        "游", "竺", "权", "逑", "盖", "益", "桓", "公", "仉", "督", "晋", "楚", "阎", "法", "汝", "鄢",
        "涂", "钦", "岳", "帅", "缑", "亢", "况", "后", "有", "琴", "归", "海", "墨", "哈", "谯", "笪",
        "年", "爱", "阳", "佟", "商", "牟", "佘", "佴", "伯", "赏",
        "万俟", "司马", "上官", "欧阳", "夏侯", "诸葛", "闻人", "东方", "赫连", "皇甫", "尉迟", "公羊",
        "澹台", "公冶", "宗政", "濮阳", "淳于", "单于", "太叔", "申屠", "公孙", "仲孙", "轩辕", "令狐",
        "锺离", "宇文", "长孙", "慕容", "鲜于", "闾丘", "司徒", "司空", "丌官", "司寇", "子车", "微生",
        "颛孙", "端木", "巫马", "公西", "漆雕", "乐正", "壤驷", "公良", "拓拔", "夹谷", "宰父", "谷梁",
        "段干", "百里", "东郭", "南门", "呼延", "羊舌", "梁丘", "左丘", "东门", "西门", "南宫"
    ]
    let givenNames = [
        "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
        "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
        "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
        "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
        "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
        "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
        "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
        "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
        "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
        "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌",
        "惠宁", "雅欣", "奕雯", "佳琪", "永怡", "璐瑶", "娟秀", "天佳", "晓华", "妍丽", "璇菡",
        "嘉禾", "忆辰", "妍彤", "眉萱", "秀辰", "怡熹", "思琦", "弦娇", "青淑", "宣淑", "和静",
        "雪涵", "美嘉", "佳涵", "旭和", "丽娇", "雨晨", "文惠", "雅馥", "雨嘉", "亦婷", "秀慧",
        "俊颖", "亭清", "思涵", "珂嘉", "蒂莲", "秀娟", "晋仪", "玮菁", "慧琳", "丽帆", "思辰",
        "宇纯", "美瑞", "蕊清", "秀敏", "家维", "宁致", "婷方", "燕晨", "子琳", "雪菲", "泓锦",
        "佳妮", "初晨", "芷菡", "奕可", "莉姿", "杏菏", "韵彩", "姝慧", "雪华", "珊娜", "秀丽",
        "箫辉", "盈初", "语楚", "青秋", "梓菁", "宝萱"
    ]
    let mans = "刚伟勇毅俊峰强军平保东文辉力明永健世广志义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清" +
        "飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕" +
        "河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏泽晨辰士以建家致树炎德行时泰盛雄琛钧冠策腾楠榕风航弘"
    let womens = "秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊兰凤洁梅琳素云莲真环雪荣爱妹霞香月莺媛艳" +
        "瑞凡佳嘉琼勤珍贞莉桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵" +
        "融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥筠柔竹霭凝鱼晓欢霄枫芸菲寒伊亚宜可姬舒影荔枝思丽墨"
    switch (gender) {
        case "男":
            return familyNames[random(0, familyNames.length - 1)] + mans[random(0, mans.length - 1)];
        case "女":
            return familyNames[random(0, familyNames.length - 1)] + womens[random(0, womens.length - 1)];
        default:
            switch (random(0, 2)) {
                case 0:
                    return familyNames[random(0, familyNames.length - 1)] + mans[random(0, mans.length - 1)];
                case 1:
                    return familyNames[random(0, familyNames.length - 1)] + womens[random(0, womens.length - 1)];
                case 2:
                    return familyNames[random(0, familyNames.length - 1)] + givenNames[random(0, givenNames.length - 1)];
            }
    }
}
/**
 * @description 随机_身份证号
 * @return {String} 随机_身份证号
 */
laoleng.RndStr.getIdCard = function () {
    let cnNewID = function (idcard) {
        let arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
        let arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码
        let sum = 0;
        for (let j = 0; j < 17; j++) {
            // 对前17位数字与权值乘积求和
            sum += parseInt(idcard[j], 10) * arrExp[j];
        }
        return arrValid[sum % 11];
    }
    let idcard = '';
    for (let i = 0; i < 18; i++) {
        if (i < 6) {
            idcard += random(0, 9)
        } else if (i === 6) {
            idcard += random(1, 2) //年份第一位仅支持1和2
        } else if (i === 7) {
            idcard += idcard[6] === '1' ? 9 : 0;//两位年份规则，仅支持19和20
        } else if (i === 8) {
            idcard += idcard[6] === '1' ? random(3, 7) : random(0, 1); //三位年份规则，仅支持193-199、200、201这些值
        } else if (i === 9) {
            idcard += random(0, 9) //四位年份规则,0-9
        } else if (i === 10) {
            idcard += random(0, 1);//首位月份规则
        } else if (i === 11) {
            idcard += idcard[10] === '0' ? random(1, 9) : random(0, 2);//末位月份规则
        } else if (i === 12) {
            let maxDays = new Date(~~idcard.substr(6, 4), ~~idcard.substr(10, 2), 0).getDate(); // 获取当月最大天数
            let day = random(1, maxDays)
            idcard += day < 10 ? ('0' + day) : day;
            i++
        } else if (i > 13 && i < 17) {
            idcard += random(0, 9)
        } else if (i === 17) {
            idcard += cnNewID(idcard);
        }
    }
    return idcard;
}
/**
 * @description 随机插入字符串
 * @param srcStr {string} 源字符串
 * @param str {string} 待插入字符串
 * @return {string} 结果
 */
laoleng.RndStr.insertStr = function (srcStr, str) {
    srcStr = srcStr.split("")
    srcStr.splice(random(0, srcStr.length - 1), 0, str)
    return srcStr.join("")
}
/**
 * @description 代理模式
 */
laoleng.shell = {};
/**
 * @description 开启飞行模式,需要root
 */
laoleng.shell.openAirMode = function () {
    return shell.sudo("settings put global airplane_mode_on 1 && am broadcast -a android.intent.action.AIRPLANE_MODE" +
        " --ez state true")
}
/**
 * @description 关闭飞行模式,需要root
 */
laoleng.shell.closeAirMode = function () {
    return shell.sudo("settings put global airplane_mode_on 0 && am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false")
}
/**
 *@description shell安装apk,代理模式
 * @param path {string} apk路径
 * @return {string}
 */
laoleng.shell.installApp = function (path) {
    return shell.execCommand("pm install -r " + path)
}
/**
 *@description shell卸载apk,代理模式
 * @param pkgName {string}包名
 * @return {string}
 */
laoleng.shell.uninstallApp = function (pkgName) {
    return shell.execCommand("pm uninstall  " + pkgName)
}
/**
 *@description 打开APP的activity页面
 * @param pkgName{string} 包名
 * @param className{string} 类名
 * @return {string}
 */
laoleng.shell.openActivity = function (pkgName, className) {
    return shell.execCommand("am start -n " + pkgName + "/" + className)
}
/**
 * @description 跳转scheme,需要root
 * @param scheme {string} scheme
 * @return {string}
 */
laoleng.shell.openScheme = function (scheme) {
    return shell.sudo("am start -a android.intent.action.VIEW -d '" + scheme + "'")
}
/**
 * @description 获取顶层应用包名与组件名
 * @param mode{number?} 默认不填,如果默认获取不到可切换0/1
 * @return {string}  bin.mt.plus/.Main
 */
laoleng.shell.getRunningActivity = function (mode) {
    let ret = shell.execCommand("dumpsys activity top")
    if (ret) {
        if (mode) {
            if (mode === 0) {
                ret = ret.match(/ACTIVITY ([^/]+)/)
            } else {
                ret = ret.match(/ACTIVITY .-\/([^ ]+)/)
            }
        } else {
            ret = ret.match(/ACTIVITY ([^ ]+)/)
        }
        if (ret) return ret[1]
    }
    return ""
}
/**
 *@description shell获取cpu核心温度
 * @return {number} cpu核心温度
 */
laoleng.shell.getCpuTemp = function () {
    let list = ["/sys/devices/system/cpu/cpu0/cpufreq/cpu_temp",
        "/sys/devices/system/cpu/cpu0/cpufreq/FakeShmoo_cpu_temp",
        "/sys/class/thermal/thermal_zone0/temp",
        "/sys/class/i2c-adapter/i2c-4/4-004c/temperature",
        "/sys/devices/platform/tegra-i2c.3/i2c-4/4-004c/temperature",
        "/sys/devices/platform/omap/omap_temp_sensor.0/temperature",
        "/sys/devices/platform/tegra_tmon/temp1_input",
        "/sys/kernel/debug/tegra_thermal/temp_tj",
        "/sys/devices/platform/s5p-tmu/temperature",
        "/sys/class/thermal/thermal_zone1/temp",
        "/sys/class/hwmon/hwmon0/device/temp1_input",
        "/sys/devices/virtual/thermal/thermal_zone1/temp",
        "/sys/devices/virtual/thermal/thermal_zone0/temp",
        "/sys/class/thermal/thermal_zone3/temp",
        "/sys/class/thermal/thermal_zone4/temp",
        "/sys/class/hwmon/hwmonX/temp1_input",
        "/sys/devices/platform/s5p-tmu/curr_temp"]
    for (let i = 0; i < list.length; i++) {
        let tmp = ~~shell.execCommand("cat " + list[i]) / 1000
        if (tmp) {
            // logd(list[i]);
            return ~~tmp
        }
    }
    return 0
}
/**
 * @description shell获取电池温度
 * @return {number}电池温度
 */
laoleng.shell.getBatteryTemp = function () {
    let tmp = shell.execCommand("dumpsys battery")
    if (tmp) return ~~laoleng.String.getMiddleText(tmp, "temperature: ", "technology") / 10
    return 0
}

laoleng.String = {};
/**
 * @description String拓展替换所有
 * @param searchValue {string} 待替换数据
 * @param replaceValue {string?} 替换数据,默认""
 * @return {string} 替换后的数据
 */
String.prototype.replaceAll = function (searchValue, replaceValue) {
    return this.replace(new RegExp(searchValue, "gm"), replaceValue ? replaceValue : "")
}

/**
 * @description 格式化字符串（文本替换）
 * @param {String} str 源字符串。如：'确定要{0}单据【{1}】吗？'
 * @param {*} args 要替换的参数,支持多参。如：'删除', 'QZYDYJZB201901300002'
 * @return {String} 如：'确定要删除单据【QZYDYJZB201901300002】吗？'
 */
laoleng.String.format = function (str, args) {
    for (let i = 1, len = arguments.length; i < len; i++) {
        let reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        arguments[0] = arguments[0].replace(reg, arguments[i]);
    }
    return arguments[0];
}
/**
 * @description 取中间文本
 * @param str {string}源字符串
 * @param start {string}起始字符串
 * @param end {string} 末尾字符串
 * @param retain {boolean?} 是否保留截取字符,默认false
 * @return {string} 取出的中间文本
 */
laoleng.String.getMiddleText = function (str, start, end, retain) {
    if (!str || !start || !end) return ""
    let a = str.indexOf(start)
    if (a !== -1) {
        a += start.length;
        let e = str.indexOf(end, a);
        if (e > a) {
            return retain ? str.substring(a - start.length, e + end.length) : str.substring(a, e)
        }
    }
    return ""
}
/**
 * @description 取中间文本,最大匹配
 * @param str {string}源字符串
 * @param start {string}起始字符串
 * @param end {string} 末尾字符串
 * @param retain {boolean?} 是否保留截取字符,默认false
 * @return {string} 取出的中间文本
 */
laoleng.String.getMiddleTextBig = function (str, start, end, retain) {
    if (!str || !start || !end) return ""
    let a = str.indexOf(start)
    if (a !== -1) {
        a += start.length;
        let e = str.lastIndexOf(end);
        if (e > a) {
            return retain ? str.substring(a - start.length, e + end.length) : str.substring(a, e)
        }
    }
    return ""
}

/**
 * @description 取前面文本
 * @param srcStr {string} 源字符串
 * @param str{string} 定位字符串
 * @return {string} 取前面文本
 */
laoleng.String.getBeforeText = function (srcStr, str) {
    if (!srcStr || !str) return ""
    return srcStr.substring(0, srcStr.indexOf(str))
}
/**
 * @description 取后面文本
 * @param srcStr {string}源字符串
 * @param str {string}定位字符串
 * @return {string} 取后面文本
 */
laoleng.String.getAfterText = function (srcStr, str) {
    if (!srcStr || !str) return ""
    return srcStr.substring(srcStr.indexOf(str) + str.length)
}
/**
 * @description 判断字符串是否以指定字符串开头
 * @param {String} str 源字符串
 * @param {String} searchString 要查询的字符串
 * @param {Boolean?} ignoreCase 是否忽略大小写，默认false
 * @return {Boolean}
 */
laoleng.String.isStartWith = function (str, searchString, ignoreCase) {
    if (str === null || str === undefined) return false;
    let preSubStr = str.substring(0, searchString.length) + '';
    if (ignoreCase) {
        preSubStr = preSubStr.toLowerCase();
        searchString = (searchString + '').toLowerCase();
    }
    return preSubStr === searchString;
}

/**
 * @description 判断字符串是否以指定字符串结束
 * @param {String} str 源字符串
 * @param {String} searchString 要查询的字符串
 * @param {Boolean?} ignoreCase 是否忽略大小写，默认false
 * @return {Boolean}
 */
laoleng.String.isEndWith = function (str, searchString, ignoreCase) {
    if (str === null || str === undefined) return false;
    let lastSubStr = str.substring(str.length - searchString.length, str.length) + '';
    if (ignoreCase) {
        lastSubStr = lastSubStr.toLowerCase();
        searchString = (searchString + '').toLowerCase();
    }
    return lastSubStr === searchString;
}
/**
 * @description 首字母大写
 * @param {String} str 源字符串
 * @return {String}
 */
laoleng.String.firstUpperCase = function (str) {
    if (typeOf(str) !== "String") return '';
    return str.replace(/^\S/, function (s) {
        return s.toUpperCase()
    });
}
/**
 * @description 首字母小写
 * @param {String} str 源字符串
 * @return {String}
 */
laoleng.String.firstLowerCase = function (str) {
    if (typeOf(str) !== "String") return '';
    return str.replace(/^\S/, function (s) {
        return s.toLowerCase()
    });
}

/**
 * @description 反转字符串的元素顺序
 * @param {String} str 源字符串
 * @return {String}
 */
laoleng.String.reverse = function (str) {
    if (typeOf(str) !== "String") return '';
    let newStr = '';
    for (let i = str.length - 1; i >= 0; i--) {
        newStr += str[i];
    }
    return newStr;
}

/**
 * @description 字母和数字混合的编号自加1（以数字结尾）
 * @param {String} code 编号。例：'XM0001'
 * @return {String} 编号+1。例：'XM0002'
 */
laoleng.String.getNext = function (code) {
    let part1, part2;
    if (/[a-z]/i.test(code)) {
        let x = code.match(/[a-z]/ig);
        part1 = x.join('');
        part2 = code.substring(x.length);
    } else {
        part1 = '';
        part2 = code;
    }
    let int = parseInt(part2);
    let zero = (part2 + '.').split(int + '.')[0];
    let newPart2 = zero + (int + 1).toString();
    return part1 + newPart2;
}
/**
 * @description 数字颜色转hex
 * @param {String} color 数字颜色。例：'-156654'
 * @return {String} hex 0xffffff
 */
laoleng.String.getHexString = function (color) {
    let s = "0x";
    let colorStr = (color & 0xff000000) | (color & 0x00ff0000) | (color & 0x0000ff00) | (color & 0x000000ff);
    s += java.lang.Integer.toHexString(colorStr);
    return s;
}

/**
 * @description 字符串转bytes
 * @param {String} str 源字符串 "abc"
 * @return {bytes[]} bytes [B@8a3bd58
 */
laoleng.String.stringToBytes = function (str) {
    return new java.lang.String(str).getBytes()
}
/**
 * @description bytes转字符串
 * @param {bytes[]} bytes [B@8a3bd58
 * @return {String} string  "abc"
 */
laoleng.String.byteToString = function (bytes) {
    return new java.lang.String(bytes)
}
/**
 * @description base64加密
 * @param {String} str "abc"
 * @return {String} string "YWJj"
 */
laoleng.String.base64Encode = function (str) {
    importClass(android.util.Base64)
    return Base64.encodeToString(this.stringToBytes(str), Base64.NO_WRAP)
}
/**
 * @description base64解密,返回字符串
 * @param {String} str "YWJj"
 * @return {String} string "abc"
 */
laoleng.String.base64Decode = function (str) {
    importClass(android.util.Base64)
    return this.byteToString(Base64.decode(str, Base64.DEFAULT))
}

/**
 * 解码 URL Safe base64 -> base64
 * @description: URL Safe base64
 * '-' -> '+'
 * '_' -> '/'
 * 字符串长度%4,补'='
 * @param {string} base64Str
 * @return: Base64 string;
 */
laoleng.String.urlSafeBase64Decode = function (base64Str) {
    if (!base64Str) return;
    let safeStr = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    let num = safeStr.length % 4;
    return safeStr + '===='.substring(0, num);
}

/**
 * 编码 base64 -> URL Safe base64
 * @description: base64
 * '+' -> '-'
 * '/' -> '_'
 * '=' -> ''
 * @param {string} base64Str
 * @return: URL Safe base64 string;
 */
laoleng.String.urlSateBase64Encode = function (base64Str) {
    if (!base64Str) return;
    return base64Str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    // const UriSafe = (src: string) => src.replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_').replace(/=+$/m, ‘');

}


/**
 * @description KeyStr 代理模拟键盘输入,主要数字英文
 * @param {String} str 字符串
 * @param {number?} delay 延迟,默认50ms
 */
laoleng.Key.KeyStr = function (str, delay) {
    delay = delay || 50
    for (let i = 0; i < str.length; i++) {
        agentEvent.pressKeyCode(str[i].charCodeAt())
        sleep(delay)
    }
}
/**
 * @description 小米6lineageOS键盘查找节点点击输入
 * @param str {string}字符串
 * @param delay {number?}延迟,默认100ms
 */
laoleng.Key.KeyStrNode = function (str, delay) {
    delay = delay || 100
    for (let i = 0; i < str.length; i++) {
        while (true) {
            if (findNode(desc(str[i]).clz("com.android.inputmethod.keyboard.Key").pkg("com.android.inputmethod.latin"))) {
                g_ret.click()
                break;
            }
        }
        sleep(delay)
    }
}
