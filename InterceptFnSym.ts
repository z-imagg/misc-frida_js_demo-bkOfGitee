////fridaJs_Begin

const g_appName: string = "app.elf";

function focus_fnAdr(fnAdr:NativePointer){
  //取得该地址的调试信息
  const fnSym=DebugSymbol.fromAddress(fnAdr);
  const moduleName = fnSym.moduleName

  //断言模块名非空
  if(moduleName==null){
    throw new Error(`【断言失败】moduleName为null`)
  }

  //不关注名为空的函数
  if (fnSym.name==null || fnSym.name==undefined){
    console.log(`##不关注名为空的函数.fnAdr=[${fnAdr}]`)
    return false;
  }

  //若为主模块
  if(moduleName==g_appName   ){
    //跳过:
    if  ([ "func02_skip", "_init", "_start", "register_tm_clones", "frame_dummy", "__do_global_dtors_aux", "deregister_tm_clones", "_fini"  ].includes(fnSym.name)   )  {
      return false;
    }
    //关注:
    else{
      return true;
    }
  }

  //若为其他模块
  if(moduleName=="other.so"){
    // 'if ... return' 只关注给定条件, 不需要 全局条件 'return ...'   
    //跳过:
    if (fnSym.name == "func_other"){
      return false;
    }
  }

  //其他情况 跳过
  return false;

}


type FnAdrHex=string;
//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer):DebugSymbol {
  const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr);
  return fnSym
}


/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz:InvocationContext,  args:InvocationArguments){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const fnAdr:NativePointer=thiz.context.pc;
  const fnSym :DebugSymbol|undefined= findFnDbgSym(fnAdr)
  console.log(`[OnFnEnterBusz],fnSym=[${fnSym}]`)

  thiz.fnAdr_OnFnEnterBusz=fnAdr;



}

//{4字节对齐 工具函数
function is4times(n:number){
const is_:boolean =Math.floor( n / 4 )*4 == n ;
return is_;
}

function near4times(n:number){
  const near:number =Math.floor( (n+(4-1)) / 4 )*4   ;
  return near;
}
//}

const _C_Lang__sizeof_short=2; // sizeof(short)
//short字段 需 对齐到4字节
const C_Lang__sizeof_short=is4times(_C_Lang__sizeof_short)?_C_Lang__sizeof_short:near4times(_C_Lang__sizeof_short)
console.log(`C_Lang__sizeof_short=${C_Lang__sizeof_short}`)
const C_Lang__sizeof_float=4; // sizeof(float)
const C_Lang__sizeof_int=4; // sizeof(int)
let C_Lang__sizeof_structTUser:number=C_Lang__sizeof_short+C_Lang__sizeof_float+C_Lang__sizeof_int; // sizeof(float)



//frida中表达 函数 func01_return_int 的签名
// int func01_return_int(char ch, double real_num);
type FnType_func01 = (ch: number, real_num: number) => number;
//持有本地函数
let nativeFn__func01_return_int:FnType_func01  |null;  

//frida中表达 函数 func03_retVoid_outArgPtrStructUser 的签名
// void func03_retVoid_outArgPtrStructUser(int _userId, char sex, struct T_User* outArg_ptrStructUsr)
//持有本地函数
let nativeFn__func03_retVoid_outArgPtrStructUser:NativeFunction<void,[number,number,NativePointer]> ;  

const M_ascii:number='M'.charCodeAt(0);
/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz:InvocationContext,  retval:any ){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const fnAdr:NativePointer=thiz.context.pc;
  const fnSym :DebugSymbol|undefined= findFnDbgSym(fnAdr)
  if(fnAdr.readInt()!=thiz.fnAdr_OnFnEnterBusz.readInt()){
    console.log(`##错误，进出函数地址不同`)
  }
  console.log(`[OnFnLeaveBusz],fnSym=[${fnSym}]`)

  //调用本地函数 func01_return_int
  if(nativeFn__func01_return_int){
    const ret_int:number=nativeFn__func01_return_int(32,-33); //结果应该是-9
    console.log(`[nativeFn__func01_return_int],ret_int=[${ret_int}]`)
  } 

  //调用本地函数 func03_retVoid_outArgPtrStructUser
  if(nativeFn__func03_retVoid_outArgPtrStructUser.toInt32()!=NULL.toInt32()){
    const outArg_ptrStructUsr:NativePointer=Memory.alloc(C_Lang__sizeof_structTUser);
    nativeFn__func03_retVoid_outArgPtrStructUser.call(null,4,M_ascii,outArg_ptrStructUsr) ;
    //结构体的第1个字段 'short userId' 指针
    const ptr_filed_userId:NativePointer=outArg_ptrStructUsr.add(0);
    //结构体的第2个字段 'float salary' 指针
    const ptr_filed_salary:NativePointer=ptr_filed_userId.add(C_Lang__sizeof_short);
    //结构体的第3个字段 'int sum' 指针
    const ptr_filed_sum:NativePointer=ptr_filed_salary.add(C_Lang__sizeof_float);
    //结构体的第1个字段   userId
    const userId:number = ptr_filed_userId.readShort();
    //结构体的第2个字段   salary 
    const salary:number = ptr_filed_salary.readFloat();
    //结构体的第3个字段   sum 
    const sum:number = ptr_filed_sum.readInt();
    console.log(`[outArg_ptrStructUsr],{userId=${userId},salary=${salary}, sum=${sum} }`)
    // {userId=204,salary=3000.10009765625, sum=-123 }, 结果正确
  } 

}

function _main_(){

  //获取本地函数func01_return_int
  const func01_return_int:NativePointer = DebugSymbol.fromName("func01_return_int").address;
  nativeFn__func01_return_int=  new NativeFunction(func01_return_int, 'int',['char','double']);
  console.log(`##nativeFn__func01_return_int=${nativeFn__func01_return_int}`)

  //获取 本地函数 func03_retVoid_outArgPtrStructUser
  const func03_retVoid_outArgPtrStructUser:NativePointer = DebugSymbol.fromName("func03_retVoid_outArgPtrStructUser").address;
  nativeFn__func03_retVoid_outArgPtrStructUser=  new NativeFunction(func03_retVoid_outArgPtrStructUser, 'void',['int','char','pointer']); //函数返回类型中无法表达 自定义结构体 T_User, 因此只能用 指针参数携带返回结构体
  /* frida网站 2019年 有人提出了改进需求 将    "C structs" 和  JavaScript objects 做对应 ，但该需求始终是Open的， 这说明frida目前无法调用 调用返回类型为 结构体的本地c函数
  Map between "C structs" and JavaScript objects #1099  
https://github.com/frida/frida/issues/1099

  */
  console.log(`##nativeFn__func03_retVoid_outArgPtrStructUser=${nativeFn__func03_retVoid_outArgPtrStructUser}`)

  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  console.log(`fnAdrLs.length=${fnAdrLs.length}`)
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    if(!focus_fnAdr(fnAdr)){
      continue;
    }

    const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr)
    console.log(`关注函数 ${fnAdr}, ${fnSym}`)
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
  _main_();

}, 0);
