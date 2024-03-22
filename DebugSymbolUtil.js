//函数符号表格 全局变量
const gFnSymTab = new Map();
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
    console.log(`只有首次查调试信息文件，${JSON.stringify(fnSym)}`);
    //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
    gFnSymTab.set(fnAdr, fnSym);
    return fnSym;
}
function fridaTraceJsOnEnterBusz(thiz, log, args, state) {
    // log==console.log
    var fnSym = findFnDbgSym(thiz.context.pc);
    console.log(`源文件名=${fnSym?.fileName}`);
}
function fridaTraceJsOnLeaveBusz(thiz, log, retval, statea) {
    // log==console.log
}
