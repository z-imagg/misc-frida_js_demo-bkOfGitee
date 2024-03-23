////frida-trace初始化js
//函数符号表格 全局变量
const gFnSymTab:Map<NativePointer,DebugSymbol> = new Map();
let gFnCallId:number = 0;
//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer):DebugSymbol|undefined{
      if(gFnSymTab.has(fnAdr)){
        return gFnSymTab.get(fnAdr);
      }

        //函数地址k的详情
        const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr);

        const modNm:string|null=fnSym.moduleName;
        const fileNm:string|null=fnSym.fileName;

        //打印函数地址k
        console.log(`##只有首次查调试信息文件，${JSON.stringify(fnSym)}`);

        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        gFnSymTab.set(fnAdr, fnSym);

        return fnSym

}

//方向枚举: 函数进入 或 函数离开
enum Direct{
  // 函数进入
  EnterFn = 1,
  // 函数离开
  LeaveFn = 2,
}

class FnLog {
  //方向: 函数进入 或 函数离开
  direct:Direct;
  //函数地址
  fnAdr:NativePointer;
  //针对此次函数调用的唯一编号
  fnCallId:number;
  //函数符号
  fnSym:DebugSymbol|undefined;
  constructor (direct:Direct, fnAdr:NativePointer, fnCallId: number,fnSym:DebugSymbol|undefined) {
    this.direct = direct;
    this.fnAdr = fnAdr;
    this.fnCallId = fnCallId;
    this.fnSym = fnSym;
  }

  toJson(){
    return JSON.stringify(this)  
  }
}

/** 被frida-trace工具生成的.js函数中的onEnter调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */

function fridaTraceJsOnEnterBusz(thiz:InvocationContext, log:any, args:any[], state:any){
  var fnAdr=thiz.context.pc;
  var fnSym :DebugSymbol|undefined= findFnDbgSym(thiz.context.pc)
  thiz.fnEnterLog=new FnLog(Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
  log(thiz.fnEnterLog.toJson())

}

/** 被frida-trace工具生成的.js函数中的OnLeave调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */
function fridaTraceJsOnLeaveBusz(thiz:InvocationContext, log:any, retval:any, state:any){
  const fnEnterLog:FnLog=thiz.fnEnterLog;
  const fnLeaveLog:FnLog=new FnLog(Direct.LeaveFn, fnEnterLog.fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
  log(fnLeaveLog.toJson())
}
