// ［术语］　
// ［简写］ AbsThrdId==AbsoluteThreadId==绝对线程id==进程id_线程id , gTmPntTb == globalTimePointTable == 全局时刻表格
function nowTxt() {
    const now = new Date();
    //时区没生效，暂时忽略
    const localNowTxt = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', });
    const txt = `${now.getTime()},${localNowTxt}`;
    return txt;
}
function isNil(x) {
    const empty = (x == undefined || x == null);
    return empty;
}
function adrToHex(fnAdr) {
    return fnAdr.toString(16);
}
class TimePoint {
    static initTmPntVal(processId, thrdId) {
        return new TimePoint(processId, thrdId, 0);
    }
    constructor(processId, thrdId, tmPnt) {
        this.processId = processId;
        this.thrdId = thrdId;
        this.curTmPnt = tmPnt;
    }
    nextVal() {
        ++this.curTmPnt;
        return this.curTmPnt;
    }
    toJson() {
        return JSON.stringify(this);
    }
}
//函数符号表格 全局变量
const gFnSymTab = new Map();
//函数调用id
let gFnCallId = 0;
//日志id
let gLogId = 0;
//时刻表格 全局变量
//  进程_线程　对应的　最新时刻值
const gTmPntTb = new Map();
//填充函数符号表格
function findFnDbgSym(fnAdr) {
    // 相同内容的NativePointer可以是不同的对象，因为不能作为Map的key，必须用该NativePointer对应的字符串作为Map的key
    const fnAdrHex = adrToHex(fnAdr);
    let fnSym = gFnSymTab.get(fnAdrHex);
    if (fnSym != null && fnSym != undefined) { // !isNil(fnSym)
        // console.log(`##从缓存获得调试信息，${fnAdr}`);
        return fnSym;
    }
    //函数地址k的详情
    fnSym = DebugSymbol.fromAddress(fnAdr);
    // const modNm:string|null=fnSym.moduleName;
    // const fileNm:string|null=fnSym.fileName;
    //打印函数地址k
    console.log(`##只有首次查调试信息文件，${JSON.stringify(fnSym)}`);
    //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
    gFnSymTab.set(fnAdrHex, fnSym);
    return fnSym;
}
function toAbsThrdId(processId, thrdId) {
    const _absThrdId = `${processId}_${thrdId}`;
    return _absThrdId;
}
//填充时刻表格
function nextTmPnt(processId, thrdId) {
    const absThrdId = toAbsThrdId(processId, thrdId);
    let tmPnt = gTmPntTb.get(absThrdId);
    if (tmPnt) { // !isNil(tmPnt)
        // console.log(`##从缓存获得时刻tmPnt，　${absThrdId}:${JSON.stringify(tmPnt)}`);
        return tmPnt.nextVal();
    }
    tmPnt = TimePoint.initTmPntVal(processId, thrdId);
    gTmPntTb.set(absThrdId, tmPnt);
    console.log(`##只有首次新建对象tmPnt，${JSON.stringify(tmPnt)}`);
    return tmPnt.nextVal();
}
//方向枚举: 函数进入 或 函数离开
var Direct;
(function (Direct) {
    // 函数进入
    Direct[Direct["EnterFn"] = 1] = "EnterFn";
    // 函数离开
    Direct[Direct["LeaveFn"] = 2] = "LeaveFn";
})(Direct || (Direct = {}));
class FnLog {
    constructor(tmPntVal, logId, processId, curThreadId, direct, fnAdr, fnCallId, fnSym) {
        this.tmPnt = tmPntVal;
        this.logId = logId;
        this.processId = processId;
        this.curThreadId = curThreadId;
        this.direct = direct;
        this.fnAdr = fnAdr;
        this.fnCallId = fnCallId;
        this.fnSym = fnSym;
        //获取模块基地址
        if ((fnSym != undefined && fnSym != null)
            && (fnSym.moduleName != undefined && fnSym.moduleName != null)) {
            const md = Process.getModuleByName(fnSym.moduleName);
            this.modueBase = md.base;
        }
        else {
            this.modueBase = null;
        }
    }
    toJson() {
        return JSON.stringify(this);
    }
}
//判断两个函数地址值 是否相同
function adrEq(adr1, adr2) {
    if (adr1 == adr2) {
        return true;
    }
    const adr1Null = isNil(adr1);
    const adr2Null = isNil(adr2);
    if (adr1Null || adr2Null) {
        return false;
    }
    const adr1Hex = adrToHex(adr1); //adr1.toInt32()?
    const adr2Hex = adrToHex(adr2); //adr2.toInt32()?
    const eq = (adr1Hex == adr2Hex);
    return eq;
}
//日志开头标记
//  以换行开头的理由是，避开应用程序日志中不换行的日志 造成的干扰。
const LogLinePrefix = "\n__@__@";
/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz, args) {
    const curThreadId = Process.getCurrentThreadId();
    const tmPntVal = nextTmPnt(Process.id, curThreadId);
    var fnAdr = thiz.context.pc;
    var fnSym = findFnDbgSym(thiz.context.pc);
    thiz.fnEnterLog = new FnLog(tmPntVal, ++gLogId, Process.id, curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
    console.log(`${LogLinePrefix}${thiz.fnEnterLog.toJson()}`);
}
/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz, retval) {
    const curThreadId = Process.getCurrentThreadId();
    const tmPnt = nextTmPnt(Process.id, curThreadId);
    var fnAdr = thiz.context.pc;
    if (!adrEq(fnAdr, thiz.fnEnterLog.fnAdr)) {
        console.log(`##断言失败，onEnter、onLeave的函数地址居然不同？ 立即退出进程，排查问题. OnLeave.fnAdr=【${fnAdr}】, thiz.fnEnterLog.fnAdr=【${thiz.fnEnterLog.fnAdr}】`);
    }
    const fnEnterLog = thiz.fnEnterLog;
    const fnLeaveLog = new FnLog(tmPnt, ++gLogId, Process.id, curThreadId, Direct.LeaveFn, fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
    console.log(`${LogLinePrefix}${fnLeaveLog.toJson()}`);
}
/**
ldd /fridaAnlzAp/cgsecurity--testdisk/src/qphotorec
    linux-vdso.so.1 (0x00007ffde1da5000)
    libQt5Gui.so.5 => /lib/x86_64-linux-gnu/libQt5Gui.so.5 (0x0000793ef4200000)
    libQt5Core.so.5 => /lib/x86_64-linux-gnu/libQt5Core.so.5 (0x0000793ef3c00000)
    libQt5Widgets.so.5 => /lib/x86_64-linux-gnu/libQt5Widgets.so.5 (0x0000793ef3400000)
    libstdc++.so.6 => /lib/x86_64-linux-gnu/libstdc++.so.6 (0x0000793ef3000000)
    libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x0000793ef49e3000)
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x0000793ef2c00000)
    libGL.so.1 => /lib/x86_64-linux-gnu/libGL.so.1 (0x0000793ef495a000)
    libpng16.so.16 => /lib/x86_64-linux-gnu/libpng16.so.16 (0x0000793ef491f000)
    libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x0000793ef4903000)
    libharfbuzz.so.0 => /lib/x86_64-linux-gnu/libharfbuzz.so.0 (0x0000793ef3b31000)
    libmd4c.so.0 => /lib/x86_64-linux-gnu/libmd4c.so.0 (0x0000793ef48f1000)
    libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x0000793ef3319000)
    libdouble-conversion.so.3 => /lib/x86_64-linux-gnu/libdouble-conversion.so.3 (0x0000793ef41eb000)
    libicui18n.so.70 => /lib/x86_64-linux-gnu/libicui18n.so.70 (0x0000793ef2800000)
    libicuuc.so.70 => /lib/x86_64-linux-gnu/libicuuc.so.70 (0x0000793ef2605000)
    libpcre2-16.so.0 => /lib/x86_64-linux-gnu/libpcre2-16.so.0 (0x0000793ef4161000)
    libzstd.so.1 => /lib/x86_64-linux-gnu/libzstd.so.1 (0x0000793ef324a000)
    libglib-2.0.so.0 => /lib/x86_64-linux-gnu/libglib-2.0.so.0 (0x0000793ef2ec6000)
    /lib64/ld-linux-x86-64.so.2 (0x0000793ef4ade000)
    libGLdispatch.so.0 => /lib/x86_64-linux-gnu/libGLdispatch.so.0 (0x0000793ef2b48000)
    libGLX.so.0 => /lib/x86_64-linux-gnu/libGLX.so.0 (0x0000793ef3afd000)
    libfreetype.so.6 => /lib/x86_64-linux-gnu/libfreetype.so.6 (0x0000793ef253d000)
    libgraphite2.so.3 => /lib/x86_64-linux-gnu/libgraphite2.so.3 (0x0000793ef3ad6000)
    libicudata.so.70 => /lib/x86_64-linux-gnu/libicudata.so.70 (0x0000793ef0800000)
    libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x0000793ef2e50000)
    libX11.so.6 => /lib/x86_64-linux-gnu/libX11.so.6 (0x0000793ef06c0000)
    libbrotlidec.so.1 => /lib/x86_64-linux-gnu/libbrotlidec.so.1 (0x0000793ef3ac8000)
    libxcb.so.1 => /lib/x86_64-linux-gnu/libxcb.so.1 (0x0000793ef2513000)
    libbrotlicommon.so.1 => /lib/x86_64-linux-gnu/libbrotlicommon.so.1 (0x0000793ef2e2d000)
    libXau.so.6 => /lib/x86_64-linux-gnu/libXau.so.6 (0x0000793ef48e3000)
    libXdmcp.so.6 => /lib/x86_64-linux-gnu/libXdmcp.so.6 (0x0000793ef3242000)
    libbsd.so.0 => /lib/x86_64-linux-gnu/libbsd.so.0 (0x0000793ef2b30000)
    libmd.so.0 => /lib/x86_64-linux-gnu/libmd.so.0 (0x0000793ef3235000)
*/
const modules_include = [
    "qphotorec",
];
const modules_exclude = [
    // "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
    "linux-vdso.so.1",
    "libQt5Gui.so.5",
    "libQt5Core.so.5",
    "libQt5Widgets.so.5",
    "libstdc++.so.6",
    "libgcc_s.so.1",
    "libc.so.6",
    "libGL.so.1",
    "libpng16.so.16",
    "libz.so.1",
    "libharfbuzz.so.0",
    "libmd4c.so.0",
    "libm.so.6",
    "libdouble-conversion.so.3",
    "libicui18n.so.70",
    "libicuuc.so.70",
    "libpcre2-16.so.0",
    "libzstd.so.1",
    "libglib-2.0.so.0",
    "ld-linux-x86-64.so.2",
    "libGLdispatch.so.0",
    "libGLX.so.0",
    "libfreetype.so.6",
    "libgraphite2.so.3",
    "libicudata.so.70",
    "libpcre.so.3",
    "libX11.so.6",
    "libbrotlidec.so.1",
    "libxcb.so.1",
    "libbrotlicommon.so.1",
    "libXau.so.6",
    "libXdmcp.so.6",
    "libbsd.so.0",
    "libmd.so.0"
];
function focus_fnAdr(fnAdr) {
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    const moduleName = fnSym.moduleName;
    if (moduleName == null) {
        throw new Error(`【断言失败】moduleName为null`);
    }
    // 被frida拦截的qphotorec进程 在 onEnter到 以下函数 后 立即退出， 因此 不拦截 此些函数
    if (moduleName == "qphotorec" &&
        (fnSym.name == "main"
            || fnSym.name == "_GLOBAL__sub_I_rcc_qphotorec_locale.cpp"
            || fnSym.name == "_Z31qInitResources_qphotorec_localev"
            || fnSym.name == "_GLOBAL__sub_I_rcc_qphotorec.cpp"
            || fnSym.name == "_Z24qInitResources_qphotorecv"
            || fnSym.name == "frame_dummy"
            || fnSym.name == "register_tm_clones"
            || fnSym.name == "_init"
            || fnSym.name == "_start")) {
        return false;
    }
    if (modules_include.includes(moduleName)) {
        return true;
    }
    if (modules_exclude.includes(moduleName)) {
        return false;
    }
}
function _main_() {
    const fnAdrLs = DebugSymbol.findFunctionsMatching("*");
    const fnAdrCnt = fnAdrLs.length;
    for (let [k, fnAdr] of fnAdrLs.entries()) {
        /*修复 在拦截libc.so.6 pthread_getschedparam时抛出异常说进程已终止并停在frida终端 ： 不拦截 比如libc.so、frida-agent.so等底层*/
        if (!focus_fnAdr(fnAdr)) {
            continue;
        }
        // const fnSym=DebugSymbol.fromAddress(fnAdr);
        console.log(`##${nowTxt()};Interceptor.attach fnAdr=${fnAdr};  进度【${k}~${fnAdrCnt} 】`);
        Interceptor.attach(fnAdr, {
            onEnter: function (args) {
                OnFnEnterBusz(this, args);
            },
            onLeave: function (retval) {
                OnFnLeaveBusz(this, retval);
            }
        });
    }
}
/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决
frida 运行报超时错误 "Failed to load script: the connection is closed" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
    //业务代码
    _main_();
}, 0);
