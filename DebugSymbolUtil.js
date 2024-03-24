//函数符号表格 全局变量
const gFnSymTab = new Map();
let gFnCallId = 0;
//填充函数符号表格
function findFnDbgSym(fnAdr) {
    // 相同内容的NativePointer可以是不同的对象，因为不能作为Map的key，必须用该NativePointer对应的字符串作为Map的key
    const fnAdrHex = fnAdr.toString();
    if (gFnSymTab.has(fnAdrHex)) {
        console.log(`##从缓存获得调试信息，${fnAdr}`);
        return gFnSymTab.get(fnAdrHex);
    }
    //函数地址k的详情
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    const modNm = fnSym.moduleName;
    const fileNm = fnSym.fileName;
    //打印函数地址k
    console.log(`##只有首次查调试信息文件，${JSON.stringify(fnSym)}`);
    //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
    gFnSymTab.set(fnAdrHex, fnSym);
    return fnSym;
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
    constructor(curThreadId, direct, fnAdr, fnCallId, fnSym) {
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
/** 被frida-trace工具生成的.js函数中的onEnter调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */
function fridaTraceJsOnEnterBusz(thiz, log, args, state) {
    const curThreadId = Process.getCurrentThreadId();
    var fnAdr = thiz.context.pc;
    var fnSym = findFnDbgSym(thiz.context.pc);
    thiz.fnEnterLog = new FnLog(curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
    log(thiz.fnEnterLog.toJson());
}
/** 被frida-trace工具生成的.js函数中的OnLeave调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */
function fridaTraceJsOnLeaveBusz(thiz, log, retval, state) {
    const curThreadId = Process.getCurrentThreadId();
    var fnAdr = thiz.context.pc;
    if (fnAdr != thiz.fnEnterLog.fnAdr) {
        log(`##断言失败，onEnter、onLeave的函数地址居然不同？ 立即退出进程，排查问题. OnLeave.fnAdr=【${fnAdr}】, thiz.fnEnterLog.fnAdr=【${thiz.fnEnterLog.fnAdr}】`);
    }
    const fnEnterLog = thiz.fnEnterLog;
    const fnLeaveLog = new FnLog(curThreadId, Direct.LeaveFn, fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
    log(fnLeaveLog.toJson());
}
