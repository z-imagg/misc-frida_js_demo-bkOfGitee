////frida-trace初始化js

// ［术语］　
// ［简写］ AbsThrdId==AbsoluteThreadId==绝对线程id==进程id_线程id , gTmPntTb == globalTimePointTable == 全局时刻表格
function isNil(x:any):boolean{
  const empty=(x == undefined || x==null);
  return empty;
}

type FnAdrHex=string;
function adrToHex(fnAdr:NativePointer):FnAdrHex{
  return fnAdr.toString(16);
}

type AbsThrdId=string;
//时刻
type TmPntVal=number;
class TimePoint {
  static initTmPntVal(processId:number,thrdId:ThreadId){
    return new TimePoint(processId,thrdId,0)
  }
  //进程id
  processId:number
  //线程id
  thrdId:ThreadId
  //进程_线程　对应的　最新时刻值
  curTmPnt:TmPntVal
  constructor (processId:number,thrdId:ThreadId,tmPnt:TmPntVal) {
    this.processId = processId
    this.thrdId = thrdId
    this.curTmPnt = tmPnt
  }

  nextVal():TmPntVal{
    ++this.curTmPnt
    return this.curTmPnt
  }
  toJson(){
    return JSON.stringify(this)  
  }
}
//函数符号表格 全局变量
const gFnSymTab:Map<FnAdrHex,DebugSymbol> = new Map();
//函数调用id
let gFnCallId:number = 0;
//日志id
let gLogId:number = 0;
//时刻表格 全局变量
//  进程_线程　对应的　最新时刻值
const gTmPntTb:Map<AbsThrdId,TimePoint> = new Map();

//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer):DebugSymbol {
  // 相同内容的NativePointer可以是不同的对象，因为不能作为Map的key，必须用该NativePointer对应的字符串作为Map的key
  const fnAdrHex:FnAdrHex=adrToHex(fnAdr);
  let fnSym:DebugSymbol|undefined=gFnSymTab.get(fnAdrHex);
      if(fnSym!=null && fnSym!=undefined){ // !isNil(fnSym)
        // console.log(`##从缓存获得调试信息，${fnAdr}`);
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

function toAbsThrdId(processId:number, thrdId:ThreadId):AbsThrdId{
  const _absThrdId:AbsThrdId=`${processId}_${thrdId}`;
  return _absThrdId
}

//填充时刻表格
function nextTmPnt(processId:number, thrdId:ThreadId):TmPntVal{
  const absThrdId:AbsThrdId=toAbsThrdId(processId,thrdId)
  let tmPnt:TimePoint|undefined=gTmPntTb.get(absThrdId);
  if(tmPnt){ // !isNil(tmPnt)
    // console.log(`##从缓存获得时刻tmPnt，　${absThrdId}:${JSON.stringify(tmPnt)}`);
    return tmPnt.nextVal();
  }

  tmPnt=TimePoint.initTmPntVal(processId,thrdId)
  gTmPntTb.set(absThrdId, tmPnt);

  console.log(`##只有首次新建对象tmPnt，${JSON.stringify(tmPnt)}`);

  return tmPnt.nextVal()

}

//方向枚举: 函数进入 或 函数离开
enum Direct{
  // 函数进入
  EnterFn = 1,
  // 函数离开
  LeaveFn = 2,
}

class FnLog {
  //进程_线程　下的　时刻值
  tmPnt:TmPntVal
  //日志id
  logId:number
  //当前进程id
  processId:number
  //当前线程id
  curThreadId:ThreadId
  //方向: 函数进入 或 函数离开
  direct:Direct;
  //函数地址
  fnAdr:NativePointer;
  //针对此次函数调用的唯一编号
  fnCallId:number;
  //函数符号
  fnSym:DebugSymbol|undefined;
  constructor (tmPntVal:TmPntVal, logId:number,processId:number,curThreadId:ThreadId, direct:Direct, fnAdr:NativePointer, fnCallId: number,fnSym:DebugSymbol|undefined) {
    this.tmPnt=tmPntVal
    this.logId = logId
    this.processId=processId
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
  const adr1Null:boolean=  isNil(adr1)
  const adr2Null:boolean=  isNil(adr2)
  if( adr1Null || adr2Null){
    return false;
  }

  const adr1Hex:FnAdrHex=adrToHex(adr1);//adr1.toInt32()?
  const adr2Hex:FnAdrHex=adrToHex(adr2);//adr2.toInt32()?

  const eq:boolean= (adr1Hex == adr2Hex);
  return eq;
}
//日志开头标记
//  以换行开头的理由是，避开应用程序日志中不换行的日志 造成的干扰。
const LogLinePrefix:string="\n__@__@";

/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz:InvocationContext,  args:InvocationArguments){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const tmPntVal:TmPntVal=nextTmPnt(Process.id,curThreadId)
  var fnAdr=thiz.context.pc;
  var fnSym :DebugSymbol|undefined= findFnDbgSym(thiz.context.pc)
  thiz.fnEnterLog=new FnLog(tmPntVal,++gLogId,Process.id,curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
  console.log(`${LogLinePrefix}${thiz.fnEnterLog.toJson()}`)

}

/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz:InvocationContext,  retval:any ){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const tmPnt:TmPntVal=nextTmPnt(Process.id,curThreadId)
  var fnAdr=thiz.context.pc;
  if(!adrEq(fnAdr,thiz.fnEnterLog.fnAdr)){
    console.log(`##断言失败，onEnter、onLeave的函数地址居然不同？ 立即退出进程，排查问题. OnLeave.fnAdr=【${fnAdr}】, thiz.fnEnterLog.fnAdr=【${thiz.fnEnterLog.fnAdr}】`)
  }
  const fnEnterLog:FnLog=thiz.fnEnterLog;
  const fnLeaveLog:FnLog=new FnLog(tmPnt,++gLogId,Process.id,curThreadId, Direct.LeaveFn, fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
  console.log(`${LogLinePrefix}${fnLeaveLog.toJson()}`)
}

const modules_include=[
  "simple_nn.elf",
  "libtorch.so.1",
  "libc10.so",
  "libcaffe2.so",
];
const modules_exclude=[
  "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
  "linux-vdso.so.1",
  "libstdc++.so.6.0.30",
  "libgcc_s.so.1",
  "libc.so.6",
  "libm.so.6",
  "ld-linux-x86-64.so.2",
  "libnuma.so.1.0.0",
  "libmpi_cxx.so.40.30.1",
  "libmpi.so.40.30.2",
  "libopen-pal.so.40.30.2",
  "libopen-rte.so.40.30.2",
  "libhwloc.so.15.5.2",
  "libevent_core-2.1.so.7.0.1",
  "libevent_pthreads-2.1.so.7.0.1",
  "libz.so.1.2.11",
  "libudev.so.1.7.2",
  "libpthread.so.0",
  "frida-agent-64.so",
  "libdl.so.2",
  "librt.so.1",
];
function focus_fnAdr(fnAdr:NativePointer){
  const fnSym=DebugSymbol.fromAddress(fnAdr);
  const moduleName = fnSym.moduleName
  if(moduleName==null){
    throw new Error(`【断言失败】moduleName为null`)
  }
  if(modules_include.includes(moduleName)){
    return true;
  }
  if(modules_exclude.includes(moduleName)){
    return false;
  }
}

function _main_(){
  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    /*修复 在拦截libc.so.6 pthread_getschedparam时抛出异常说进程已终止并停在frida终端 ： 不拦截 比如libc.so、frida-agent.so等底层*/
    if(!focus_fnAdr(fnAdr)){
      continue;
    }
    const fnSym=DebugSymbol.fromAddress(fnAdr);
    console.log(`##Interceptor.attach fnAdr=${fnAdr}; ${fnSym.name}, ${fnSym.address}, ${fnSym.moduleName}, ${fnSym.fileName}, ${fnSym.lineNumber}  `)


    Interceptor.attach(fnAdr,{
      onEnter:function  (this: InvocationContext, args: InvocationArguments) {
        OnFnEnterBusz(this,args)
      },
      onLeave:function (this: InvocationContext, retval: InvocationReturnValue) {
        OnFnLeaveBusz(this,retval)
      }

    })
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
  _main_()

}, 0);
