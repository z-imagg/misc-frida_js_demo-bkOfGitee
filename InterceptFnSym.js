// ［术语］　
// ［简写］ AbsThrdId==AbsoluteThreadId==绝对线程id==进程id_线程id , gTmPntTb == globalTimePointTable == 全局时刻表格
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
function _main_() {
    const fnAdrLs = DebugSymbol.findFunctionsMatching("*");
    for (let [k, fnAdr] of fnAdrLs.entries()) {
        const fnSym = DebugSymbol.fromAddress(fnAdr);
        console.log(`##Interceptor.attach fnAdr=${fnAdr};  ${fnSym.name}, ${fnSym.address}, ${fnSym.moduleName}, ${fnSym.fileName}, ${fnSym.lineNumber} `);
        /*
        若拦截全部函数，则在拦截libc.so.6 pthread_getschedparam时抛出异常说进程已终止并停在frida终端， 原因是 不应该拦截 比如libc.so、frida-agent.so等底层 模块？
        
        ##Interceptor.attach fnAdr=0x7ffff20962c0;  pthread_getschedparam, 0x7ffff20962c0, libc.so.6, , 0
        Spawned `/fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf`. Resuming main thread!
        Process terminated
        Exception in thread Thread-1 (_run):
        Traceback (most recent call last):
          File "/app/Miniconda3-py310_22.11.1-1/lib/python3.10/threading.py", line 1016, in _bootstrap_inner
        [Local::simple_nn.elf ]->     self.run()
          File "/app/Miniconda3-py310_22.11.1-1/lib/python3.10/threading.py", line 953, in run
            self._target(*self._args, **self._kwargs)
          File "/app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida_tools/reactor.py", line 70, in _run
            work()
          File "/app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida_tools/_repl_magic.py", line 34, in <lambda>
            repl._reactor.schedule(lambda: repl._resume())
          File "/app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida_tools/application.py", line 477, in _resume
            self._device.resume(self._spawned_pid)
          File "/app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida/core.py", line 76, in wrapper
            return f(*args, **kwargs)
          File "/app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida/core.py", line 776, in resume
            self._impl.resume(self._pid_of(target))
        frida.NotSupportedError: process not found
        [Local::simple_nn.elf ]->
        
        */
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
