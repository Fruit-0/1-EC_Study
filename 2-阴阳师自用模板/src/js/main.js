function main() {
    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    //初始化配置信息
    initConfigurations();
    // logd("开始执行脚本主逻辑...");
    //通用异常处理的子线程（时刻处理预期的异常）
    exceptionHandler();
    //主逻辑
    mainLogic();
}

function autoServiceStart(time) {
    for (let i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        let started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

main();