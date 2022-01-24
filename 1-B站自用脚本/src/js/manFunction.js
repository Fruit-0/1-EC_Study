function doMain(){
    var applyAllAuthorizeStatus =  applyAllAuthorize(true);
    if (applyAllAuthorizeStatus) {
        logd("指定权限全部赋予成功");

        toast("指定权限全部赋予成功");
    }else {
        //赋予指定的权限失败则推出脚本
        toast("指定权限全部赋予失败");
        exit();
    }
    //关闭日志悬浮窗口
    closeLogWindow();
    //关闭启停浮窗
    closeCtrlWindow();

    openMyBilibili();

    doFunction();

}



// 打开我的淘宝
function openMyBilibili() {
    utils.openApp("tv.danmaku.bili");
    logd("正在打开哔哩哔哩...");
    sleep(10000);
    while (true) {
        if (has(text("推荐").clz("android.widget.TextView"))
                && has(text("热门").clz("android.widget.TextView"))
        ) {
            break;
        }
    }
    logd("我的哔哩哔哩已成功打开~");
}


function doFunction(){
    var selectors= clz("android.widget.TextView").id("tv.danmaku.bili:id/expand_search");
    // var result = inputText(selectors,"小高姐的魔法调料");
    // if (result){
    //     toast("输入成功");
    // } else {
    //     toast("输入失败");
    // }


    var result = inputText(selectors,"我是内容");
    if (result){
        toast("是");
    } else {
        toast("否");
    }

}