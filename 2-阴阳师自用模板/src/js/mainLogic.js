//版本说明：
//  程序版本号=9.21.1.1000
//注意：
//	需提前注册并登录过手机淘宝，并玩过一次芭芭农场；
//	适用于淘宝版本=9.21.1；
//	需提前注册并登录过支付宝，并玩过一次芭芭农场；
//	适用于支付宝版本=10.2.13；
//  支付宝首页需要固定芭芭农场快捷入口；
//  建议提前清理内存，加快程序运行；
//	只限一棵免费领水果的树和一棵年货免费送的树；
//	建议提前打开淘宝，并退出到淘宝首页，再退出应用程序，使得淘宝在后台；
//	建议提前打开支付宝，并退出到支付宝首页，再退出应用程序，使得支付宝在后台；
//	如果不想执行7、8，则必须后台关闭淘宝；
//	不要在12点左右运行，服务器会出bug；
//	淘宝芭芭农场需加入一个队伍；
//	推荐淘宝设置：
//		通用 -视频自动播放：关闭
//			 -截屏后出现分享窗口：关闭
//			 -首页摇一摇：关闭
//功能说明：
//	1、集肥料任务不包括：
//		分享给好友;
//		买实惠好物送1万肥料;
//	2、包括队伍亲密值的肥料礼包领取；
//	3、不包括队伍亲密值的福气礼包领取；
//	4、集福气任务不包括：
//			邀请好友助力； 
//	5、不包括好友林；
//	6、支付宝集肥料任务不包括：
//		分享给好友;
//		购买商品得10000肥料;
//		专属肥料礼包领取;
//		喂小鸡只简单点击饲料图标;
//已知bug：
//	1、逛淘宝任务返回支付宝可能因太卡，按退出键过多而退出芭芭农场；
//	2、逛支付宝任务返回淘宝可能因太卡，返回淘宝后不在芭芭农场；
//	3、任务做完后可能会卡死（应该是机器的原因）；
//	4、淘宝逛支付宝芭芭农场的任务跳转到支付宝后，加载芭芭农场页面后，可能会没有队伍和领肥料图标，等待很久也没用（应该是机器的原因）；
/*

// 变量定义
var SCREEN_WIDTH = device.getScreenWidth();
var SCREEN_HEIGHT = device.getScreenHeight();
var xy_Return_Mianfei;
var xy_Jifeiliao_Mianfei;
var xy_Lingfeiliao_Mianfei;
var xy_Shifei_Mianfei;//施肥按钮
var xy_RightArrow_Mianfei;
var xy_Haoyoulin_Mianfei;
var xy_QuShifei_Mianfei;//去施肥，赚更多肥料
// var xy_Jifuqi_NewSeed;
// var xy_Lingfuqi_NewSeed;
// var xy_Jiaoguanfuqi_NewSeed;
var xy_Return_NewSeed;
var xy_RightArrow_NewSeed = null;
var xy_Jifeiliao_NewSeed;
//防止任务列表刷新后坐标错乱，保存好起始坐标和间距
var FirstPt_Tasks_Mianfei = new Point(null);
var Gap_Tasks_Mianfei;
var ClosePt_Tasks_Mianfei = new Point(null);
var MAXN_Tasks_Mianfei;
var QianDao_Tasks_Mianfei = new Point(null);
//淘宝人生任务中，有没有免费抽一次
var HasFreeChouXinYuanLiHe = true;
//淘宝未知任务数组
var UnknowTasks_Mianfei = [];
//是否开始支付宝异常处理程序
var IsStartZhifubaoExcp = false;*/


// 程序主逻辑
function mainLogic() {
    // ------------主程序开始 -----------------------//
    // 申请截图权限
    let request = image.requestScreenCapture(10000, 1);
    if (!request) {
        request = image.requestScreenCapture(10000, 1);
    }
    logd("申请截图权限结果... " + request);
    if (!request) {
        logd("申请截图权限失败！");
        exit();
    }
    // 关闭日志浮窗
    closeLogWindow();
    //关闭启停浮窗
    closeCtrlWindow();

    //打开淘宝
    openMyTaobao()


    // ------------主程序结束-----------------------//
}

/**
 * 打开阴阳师app
 */
function openMyYss() {
    // utils.openApp("com.huawei.android.launcher");
    //根据名称打开app
    utils.openAppByName("阴阳师");
    logd("正在打开阴阳师...");
    sleep(10000);


    // toast("正在打开阴阳师111111 ");
}


// 打开我的淘宝
function openMyTaobao() {
    utils.openApp("com.taobao.taobao");
    logd("正在打开淘宝...");
    toast("正在打开淘宝...");
    sleep(10000);
    while (true) {
        if (has(text("订阅").clz("android.widget.TextView"))
            && has(text("推荐").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("全部").clz("android.view.View"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("消息").clz("android.widget.TextView"))
            && has(desc("通讯录").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("购物车").clz("android.widget.TextView"))
                   && has(text("结算").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("设置").clz("android.view.View"))
            && has(text("芭芭农场").clz("android.widget.TextView"))) {
            let selector = text("芭芭农场").clz("android.widget.TextView");
            click(selector);
            sleep(2000);
            break;
        } else {
            back();
            sleep(2000);
        }
        sleep(1000);
    }
    logd("我的淘宝已成功打开~");
    toast("我的淘宝已成功打开~");


    //进入免费领水果主页面
    sleep(6000);
    gotoMianfeilingshuiguoSinceClickBaba();

}

// 点击芭芭农场后，从农场进入免费领水果
function gotoMianfeilingshuiguoSinceClickBaba() {
    let firstInNewSeed = true;
    while (true) {
        if (isInMianfeilingshuiguo()) {
            break;
        } else if (isGoingToBabanongchang()) {
            // sleep(2000);
        } else if (isInBabanongchang()) {
            sleep(2000);
            clickFruitFarm();
            sleep(2000);
        } else if (isGoingToMianfeilingshuiguo()) {
            sleep(2000);
        } else if (isInNewSeed()) {
            //免费领水果页面未初始化完毕时，会被误判为新种子页面！
            if (firstInNewSeed) {
                firstInNewSeed = false;
            } else {
                if (xy_RightArrow_NewSeed == null) {
                    getKeyXY_NewSeed();
                }
                if (xy_RightArrow_NewSeed != null) {
                    clickPoint(xy_RightArrow_NewSeed.x, xy_RightArrow_NewSeed.y);
                    sleep(5000);
                }
            }
        } else if (has(desc("设置").clz("android.view.View")) && has(text("芭芭农场").clz("android.widget.TextView"))) {
            let selector = text("芭芭农场").clz("android.widget.TextView");
            click(selector);
            sleep(2000);
        }
        sleep(3000);
    }
}

// 判断是否在 免费领水果 主页面
function isInMianfeilingshuiguo() {
    let ret1 = has(text('天猫农场-福年种福果').clz('android.webkit.WebView'));
    let ret2 = has(text('做任务赢奖励').clz('android.view.View'));
    // let ret3 = has(textMatch("^couponlist"));
    let ret5 = has(text('我').clz('android.view.View')) || has(text('邀请').clz('android.view.View'));
    return ret1 && (!ret2) && ret5;
}

