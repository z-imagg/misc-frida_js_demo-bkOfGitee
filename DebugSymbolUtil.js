//函数符号表格 全局变量
const gFnSymTab = new Map();
let gFnCallId = 0;
//填充函数符号表格
function findFnDbgSym(fnAdr) {
    if (gFnSymTab.has(fnAdr)) {
        return gFnSymTab.get(fnAdr);
    }
    //函数地址k的详情
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    const modNm = fnSym.moduleName;
    const fileNm = fnSym.fileName;
    //打印函数地址k
    console.log(`##只有首次查调试信息文件，${JSON.stringify(fnSym)}`);
    //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
    gFnSymTab.set(fnAdr, fnSym);
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
    constructor(direct, fnAdr, fnCallId, fnSym) {
        this.direct = direct;
        this.fnAdr = fnAdr;
        this.fnCallId = fnCallId;
        this.fnSym = fnSym;
    }
    toJson() {
        return JSON.stringify(this);
    }
}
/**不必用log('xxx'), 直接用console.log('xxx') 即可
 * log==console.log
 * 被frida-trace工具生成的.js函数中的onEnter调用的函数中 可以使用 console.log
 */
function fridaTraceJsOnEnterBusz(thiz, log, args, state) {
    var fnAdr = thiz.context.pc;
    var fnSym = findFnDbgSym(thiz.context.pc);
    thiz.fnEnterLog = new FnLog(Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
    log(thiz.fnEnterLog.toJson());
}
function fridaTraceJsOnLeaveBusz(thiz, log, retval, state) {
    const fnEnterLog = thiz.fnEnterLog;
    const fnLeaveLog = new FnLog(Direct.LeaveFn, fnEnterLog.fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
    log(fnLeaveLog.toJson());
}
