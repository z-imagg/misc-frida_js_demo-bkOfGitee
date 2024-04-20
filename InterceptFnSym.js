// ［术语］　
// ［简写］ AbsThrdId==AbsoluteThreadId==绝对线程id==进程id_线程id , gTmPntTb == globalTimePointTable == 全局时刻表格
function baseNameOfFilePath(filePath) {
    // const filePath = '/app/qemu/build-v8.2.2/qemu-system-x86_64';
    const parts = filePath.split('/');
    const baseName = parts[parts.length - 1];
    // console.log(baseName); 
    return baseName;
}
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
function focus_fnAdr(fnAdr) {
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    const moduleName = fnSym.moduleName;
    if (moduleName == null) {
        throw new Error(`【断言失败】moduleName为null`);
    }
    // 解决frida拦截目标进程中途崩溃 步骤  == frida_js_skip_crashFunc_when_Interceptor.attach.onEnter.md 
    // 日志量高达3千万行。 疑似特别长的有 pit_irq_timer 、 generate_memory_topology ， 尝试跳过
    if (moduleName == g_appName &&
        (fnSym.name == "pit_irq_timer" ||
            fnSym.name == "generate_memory_topology")) {
        return false;
    }
    /**已确认 结束时frida出现'Process terminated' 对应的进程qphotorec有正常退出码0
    https://gitee.com/repok/dwmkerr--linux-kernel-module/blob/e36a16925cd60c6e4b3487d254bfe7fa5b150f75/greeter/run.sh
    */
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
/** firda拦截应用的main函数并添加参数，注意只有类c编译器产生的应用才有main函数
 *
 * 添加参数 /app/qemu/build-v8.2.2/qemu-system-x86_64 -nographic  -append "console=ttyS0"  -kernel  /bal/linux-stable/arch/x86/boot/bzImage -initrd /bal/bldLinux4RunOnBochs/initramfs-busybox-i686.cpio.tar.gz
 * 参考 :  https://stackoverflow.com/questions/72871352/frida-spawn-a-windows-linux-process-with-command-line-arguments/72880066#72880066
 *
 readelf --symbols /app/qemu/build/qemu-system-x86_64 | egrep "main$"
 37431: 00000000003153f0    23 FUNC    GLOBAL DEFAULT   16 main

 这种就是有main函数的

 */
function mainFunc_addArgTxt(mnArgTxt) {
    if (mnArgTxt.length == 0) {
        console.log("##main参数为空");
        return;
    }
    const mnFnPtr = DebugSymbol.fromName("main").address;
    if (mnFnPtr == null || mnFnPtr == undefined) {
        console.log("##无main函数,无法通过拦截main函数来添加参数,可能不是类c编译器产生的应用");
        return;
    }
    console.log(`##收到main函数参数mnArgTxt=${mnArgTxt}`);
    const mnArgStrLs_raw = mnArgTxt.split(" ");
    const mnArgStrLs = mnArgStrLs_raw.filter(elm => elm != "");
    Interceptor.attach(mnFnPtr, {
        onEnter: function (args) {
            console.log(`##进入main函数`);
            // main(int argc, char** argv): args[0] == int argc, args[1] == wchar *argv[]
            const mnArgMemLs = mnArgStrLs.map(mnArgStr => Memory.allocUtf8String(mnArgStr));
            const mnArgVect = Memory.alloc(mnArgMemLs.length * Process.pointerSize);
            //参数列表作为this的字段，防止被垃圾回收
            this.mnArgVect = mnArgVect;
            for (let [k, argK] of mnArgMemLs.entries()) {
                //每个参数都作为this的字段，防止被垃圾回收
                this[`mnArgMem${k}`] = argK;
                mnArgVect.add(k * Process.pointerSize).writePointer(argK);
            }
            // 覆盖 main(int argc, char** argv) 中的argc 、 argv
            args[0] = ptr(mnArgMemLs.length);
            args[1] = mnArgVect;
        }
    });
}
//应用程序全路径
const g_appFullPath = '/app/qemu/build-v8.2.2/qemu-system-x86_64';
//应用程序名字
const g_appName = baseNameOfFilePath(g_appFullPath);
/**
ldd /app/qemu/build-v8.2.2/qemu-system-x86_64
        linux-vdso.so.1 (0x00007ffff7fc1000)
        libpixman-1.so.0 => /lib/x86_64-linux-gnu/libpixman-1.so.0 (0x00007ffff67a2000)
        libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007ffff6786000)
        libgio-2.0.so.0 => /lib/x86_64-linux-gnu/libgio-2.0.so.0 (0x00007ffff65ad000)
        libgobject-2.0.so.0 => /lib/x86_64-linux-gnu/libgobject-2.0.so.0 (0x00007ffff654d000)
        libglib-2.0.so.0 => /lib/x86_64-linux-gnu/libglib-2.0.so.0 (0x00007ffff6413000)
        libgmodule-2.0.so.0 => /lib/x86_64-linux-gnu/libgmodule-2.0.so.0 (0x00007ffff640a000)
        libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007ffff6323000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ffff60fa000)
        /lib64/ld-linux-x86-64.so.2 (0x00007ffff7fc3000)
        libmount.so.1 => /lib/x86_64-linux-gnu/libmount.so.1 (0x00007ffff60b6000)
        libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007ffff608a000)
        libffi.so.8 => /lib/x86_64-linux-gnu/libffi.so.8 (0x00007ffff607d000)
        libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x00007ffff6005000)
        libblkid.so.1 => /lib/x86_64-linux-gnu/libblkid.so.1 (0x00007ffff5fce000)
        libpcre2-8.so.0 => /lib/x86_64-linux-gnu/libpcre2-8.so.0 (0x00007ffff5f37000)
*/
const modules_include = [
    g_appName,
];
// "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
// ldd /app/qemu/build-v8.2.2/qemu-system-x86_64 | awk '{print " \""$1"\","}'
const modules_exclude = [
    "linux-vdso.so.1",
    "libpixman-1.so.0",
    "libz.so.1",
    "libgio-2.0.so.0",
    "libgobject-2.0.so.0",
    "libglib-2.0.so.0",
    "libgmodule-2.0.so.0",
    "libm.so.6",
    "libc.so.6",
    "/lib64/ld-linux-x86-64.so.2",
    "libmount.so.1",
    "libselinux.so.1",
    "libffi.so.8",
    "libpcre.so.3",
    "libblkid.so.1",
    "libpcre2-8.so.0",
];
/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决
frida 运行报超时错误 "Failed to load script: the connection is closed" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
    const mnArgTxt = '/app/qemu/build-v8.2.2/qemu-system-x86_64 -nographic  -append "console=ttyS0"  -kernel  /bal/linux-stable/arch/x86/boot/bzImage -initrd /bal/bldLinux4RunOnBochs/initramfs-busybox-i686.cpio.tar.gz';
    //业务代码
    mainFunc_addArgTxt(mnArgTxt);
    _main_();
}, 0);
