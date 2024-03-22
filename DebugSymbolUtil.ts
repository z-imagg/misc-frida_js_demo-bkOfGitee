////frida-trace初始化js
//函数符号表格 全局变量
const gFnSymTab:Map<NativePointer,DebugSymbol> = new Map();
//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer){
      if(gFnSymTab.has(fnAdr)){
        return gFnSymTab.get(fnAdr);
      }

        //函数地址k的详情
        const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr);

        const modNm:string|null=fnSym.moduleName;
        const fileNm:string|null=fnSym.fileName;

        //打印函数地址k
        console.log(`只有首次查调试信息文件，${JSON.stringify(fnSym)}`);

        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        gFnSymTab.set(fnAdr, fnSym);

        return fnSym

}

function fridaTraceJsOnEnterBusz(thiz:InvocationContext, log:any, args:any[], state:any){
  // log==console.log

  var fnSym = findFnDbgSym(thiz.context.pc)
  log(`在OnEnter中获得本函数的fnSym=${JSON.stringify(fnSym)}`)

}
function fridaTraceJsOnLeaveBusz(thiz:InvocationContext, log:any, retval:any, statea:any){
  // log==console.log

}
