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
    if (!isNil(fnSym)) {
        console.log(`##从缓存获得调试信息，${fnAdr}`);
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
        console.log(`##从缓存获得时刻tmPnt，　${absThrdId}:${tmPnt}`);
        return tmPnt.nextVal();
    }
    tmPnt = TimePoint.initTmPntVal(processId, thrdId);
    gTmPntTb.set(absThrdId, tmPnt);
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
        this.tmPntVal = tmPntVal;
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
/** 被frida-trace工具生成的.js函数中的onEnter调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */
function fridaTraceJsOnEnterBusz(thiz, log, args, state) {
    const curThreadId = Process.getCurrentThreadId();
    const tmPntVal = nextTmPnt(Process.id, curThreadId);
    var fnAdr = thiz.context.pc;
    var fnSym = findFnDbgSym(thiz.context.pc);
    thiz.fnEnterLog = new FnLog(tmPntVal, ++gLogId, Process.id, curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
    log(thiz.fnEnterLog.toJson());
}
/** 被frida-trace工具生成的.js函数中的OnLeave调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */
function fridaTraceJsOnLeaveBusz(thiz, log, retval, state) {
    const curThreadId = Process.getCurrentThreadId();
    const tmPnt = nextTmPnt(Process.id, curThreadId);
    var fnAdr = thiz.context.pc;
    if (!adrEq(fnAdr, thiz.fnEnterLog.fnAdr)) {
        log(`##断言失败，onEnter、onLeave的函数地址居然不同？ 立即退出进程，排查问题. OnLeave.fnAdr=【${fnAdr}】, thiz.fnEnterLog.fnAdr=【${thiz.fnEnterLog.fnAdr}】`);
    }
    const fnEnterLog = thiz.fnEnterLog;
    const fnLeaveLog = new FnLog(tmPnt, ++gLogId, Process.id, curThreadId, Direct.LeaveFn, fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
    log(fnLeaveLog.toJson());
}
