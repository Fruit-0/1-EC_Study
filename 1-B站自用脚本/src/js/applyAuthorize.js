/**
 * 申请指定的权限所有权限
 * todo 现在只写了一种截图的权限，后续需要补充晚上
 * @param needPicture 是否需要截图的权限
 * @return authorizeStatus 是否所有申请的权限全部申请到了(true-是；false-否)
 */
function applyAllAuthorize(needPicture) {
    var authorizeStatus = true;
    if (needPicture) {
      var pictureAuthorize =   applyAuthorizePicture();
        if (pictureAuthorize) {
            logi("截图权限申请成功！");
        }else {
            logi("截图权限申请失败！");
            authorizeStatus = false;
        }
    }
    return authorizeStatus;
}

/**
 * 申请截图权限
 * 向系统申请屏幕截图权限，返回是否请求成功。
 * 第一次使用该函数会弹出截图权限请求，建议选择“总是允许”。
 * 这个函数只是申请截图权限，并不会真正执行截图，真正的截图函数是captureScreen()。
 * 该函数在截图脚本中只需执行一次，而无需每次调用captureScreen()都调用一次。
 * @param timeout 超时时间，单位是毫秒
 * @param type 截屏的类型，0 自动选择，1 代表授权模式，2 代表无需权限模式（该模式前提条件：运行模式为代理模式）
 * @return true 代表成功 false代表失败
 */
function applyAuthorizePicture() {
    //截图授权的申请状态
    var pictureAuthorizeStatus = true;
    // logd("isServiceOk "+isServiceOk());
    startEnv()
    // logd("isServiceOk "+isServiceOk());
    let request = image.requestScreenCapture(10000,0);
    if (!request) {
        request = image.requestScreenCapture(10000,0);
    }
    logd("申请截图结果... "+request)
    if(!request){
        loge("申请截图权限失败,检查是否开启后台弹出,悬浮框等权限")
        pictureAuthorizeStatus= false;
    }
    //申请完权限至少等1s(垃圾设备多加点)再截图,否则会截不到图
    sleep(1000)

    return pictureAuthorizeStatus;

}