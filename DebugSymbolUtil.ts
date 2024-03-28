////frida-trace初始化js

function isNil(x:any):boolean{
  const empty=(x == undefined || x==null);
  return empty;
}

type FnAdrHex=string;


//函数符号表格 全局变量
const gFnSymTab:Map<FnAdrHex,DebugSymbol> = new Map();
let gFnCallId:number = 0;
//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer):DebugSymbol|undefined{
  // 相同内容的NativePointer可以是不同的对象，因为不能作为Map的key，必须用该NativePointer对应的字符串作为Map的key
  const fnAdrHex:FnAdrHex=fnAdr.toString();
  let fnSym:DebugSymbol|undefined=gFnSymTab.get(fnAdrHex);
      if(!isNil(fnSym)){
        console.log(`##从缓存获得调试信息，${fnAdr}`);
        return fnSym;
      }

        //函数地址k的详情
        fnSym=DebugSymbol.fromAddress(fnAdr);

        // const modNm:string|null=fnSym.moduleName;
        // const fileNm:string|null=fnSym.fileName;

        //打印函数地址k
        console.log(`##只有首次查调试信息文件，${JSON.stringify(fnSym)}`);

        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        gFnSymTab.set(fnAdrHex, fnSym);

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
  curThreadId:ThreadId
  //方向: 函数进入 或 函数离开
  direct:Direct;
  //函数地址
  fnAdr:NativePointer;
  //针对此次函数调用的唯一编号
  fnCallId:number;
  //函数符号
  fnSym:DebugSymbol|undefined;
  constructor (curThreadId:ThreadId, direct:Direct, fnAdr:NativePointer, fnCallId: number,fnSym:DebugSymbol|undefined) {
    this.curThreadId = curThreadId
    this.direct = direct;
    this.fnAdr = fnAdr;
    this.fnCallId = fnCallId;
    this.fnSym = fnSym;
  }

  toJson(){
    return JSON.stringify(this)  
  }
}

//判断两个函数地址值 是否相同
function adrEq(adr1:NativePointer, adr2:NativePointer){
  if(adr1==adr2){
    return true;
  }
  const adr1Null:boolean= (adr1 == undefined || adr1 == null)
  const adr2Null:boolean= (adr2 == undefined || adr2 == null)
  if( adr1Null || adr2Null){
    return false;
  }

  const adr1Hex:FnAdrHex=adr1.toString();//adr1.toInt32()?
  const adr2Hex:FnAdrHex=adr2.toString();//adr2.toInt32()?

  const eq:boolean= (adr1Hex == adr2Hex);
  return eq;
}
/** 被frida-trace工具生成的.js函数中的onEnter调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */

function fridaTraceJsOnEnterBusz(thiz:InvocationContext, log:any, args:any[], state:any){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  var fnAdr=thiz.context.pc;
  var fnSym :DebugSymbol|undefined= findFnDbgSym(thiz.context.pc)
  thiz.fnEnterLog=new FnLog(curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
  log(thiz.fnEnterLog.toJson())

}

/** 被frida-trace工具生成的.js函数中的OnLeave调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */
function fridaTraceJsOnLeaveBusz(thiz:InvocationContext, log:any, retval:any, state:any){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  var fnAdr=thiz.context.pc;
  if(!adrEq(fnAdr,thiz.fnEnterLog.fnAdr)){
    log(`##断言失败，onEnter、onLeave的函数地址居然不同？ 立即退出进程，排查问题. OnLeave.fnAdr=【${fnAdr}】, thiz.fnEnterLog.fnAdr=【${thiz.fnEnterLog.fnAdr}】`)
  }
  const fnEnterLog:FnLog=thiz.fnEnterLog;
  const fnLeaveLog:FnLog=new FnLog(curThreadId, Direct.LeaveFn, fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
  log(fnLeaveLog.toJson())
}
