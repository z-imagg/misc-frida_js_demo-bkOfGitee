////frida-trace初始化js
//函数符号表格 全局变量
const gFnSymTab:Map<NativePointer,DebugSymbol> = new Map();
let gFnCallId:number = 0;
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
  console.log(JSON.stringify(fnSym))
  gFnCallId++;
  thiz.fnCallId=gFnCallId;
  //  被frida-trace工具生成的.js函数中的onEnter调用的函数中 可以使用 console.log
  console.log(`OnEnter_fnCallId=${thiz.fnCallId}`)

}
function fridaTraceJsOnLeaveBusz(thiz:InvocationContext, log:any, retval:any, state:any){
  // log==console.log
  console.log(`OnLeave_fnCallId=${thiz.fnCallId}`)
}
