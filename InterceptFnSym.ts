//MyTsBegin//主ts文件开始标记

// 以命令MyTsCmd从配置文件config.json读取应用程序名 填充到下一行
//MyTsCmd//_replaceSubStrInNextLine("_appName_" ,  _fileName(_jsonLoad0("./config.json","$.appPath")) , curNextLn )
const g_appName: string = "_appName_";

const logf:File=new File("./InterceptFnSym.log","w");

// 以命令MyTsCmd导入文件 _focus_fnAdr.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_focus_fnAdr.ts" , curNextLn)


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
  logf.write(`[OnFnEnterBusz],fnSym=[${fnSym}]`)

  thiz.fnAdr_OnFnEnterBusz=fnAdr;



}

// 以命令MyTsCmd导入文件 _tool.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_tool.ts" , curNextLn)

// 以命令MyTsCmd导入文件 _nativeFn_func04.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_nativeFn_func04.ts" , curNextLn)


// 以命令MyTsCmd导入文件 _nativeFn_func01.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_nativeFn_func01.ts" , curNextLn)


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
    logf.write(`##错误，进出函数地址不同`)
  }
  logf.write(`[OnFnLeaveBusz],fnSym=[${fnSym}]`)

  //调用本地函数 func01_return_int
  demo_call_nativeFn_func01(  );

  //调用本地函数 func03_retVoid_outArgPtrStructUser
  if(nativeFn__func03_retVoid_outArgPtrStructUser.toInt32()!=NULL_num){
    const outArg_ptrStructUsr:NativePointer=Memory.alloc(C_Lang__sizeof_structTUser);
    //指针参数outArg_ptrStructUsr携带返回结构体
    nativeFn__func03_retVoid_outArgPtrStructUser.call(null,4,M_ascii,outArg_ptrStructUsr) ;
    //将c结构体'struct T_User'转为ts的类Struct_TUser
    const retStructTUser=new Struct_TUser(outArg_ptrStructUsr)
    logf.write(`[outArg_ptrStructUsr],{userId=${retStructTUser.userId},salary=${retStructTUser.salary}, sum=${retStructTUser.sum} }`)
    // {userId=204,salary=3000.10009765625, sum=-123 }, 结果正确
  } 

  //调用本地函数 func04_retVoid_outArgCharBuffer
  demo_call_nativeFn_func04(  );

}//end of OnFnLeaveBusz

function _main_(){

  //获取本地函数 func01_return_int
  get__func01_return_int();

  //获取 本地函数 func03_retVoid_outArgPtrStructUser
  const func03_retVoid_outArgPtrStructUser:NativePointer = DebugSymbol.fromName("func03_retVoid_outArgPtrStructUser").address;
  nativeFn__func03_retVoid_outArgPtrStructUser=  new NativeFunction(func03_retVoid_outArgPtrStructUser, 'void',['int','char','pointer']); //函数返回类型中无法表达 自定义结构体 T_User, 因此只能用 指针参数携带返回结构体
  /* frida网站 2019年 有人提出了改进需求 将    "C structs" 和  JavaScript objects 做对应 ，但该需求始终是Open的， 这说明frida目前无法调用 调用返回类型为 结构体的本地c函数
  Map between "C structs" and JavaScript objects #1099  
https://github.com/frida/frida/issues/1099

  */
  logf.write(`##nativeFn__func03_retVoid_outArgPtrStructUser=${nativeFn__func03_retVoid_outArgPtrStructUser}`)

  //获取 本地函数 func04_retVoid_outArgCharBuffer
  get__func04_retVoid_outArgCharBuffer();


  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  logf.write(`fnAdrLs.length=${fnAdrLs.length}`)
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    if(!focus_fnAdr(fnAdr,g_appName)){
      continue;
    }

    const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr)
    logf.write(`关注函数 ${fnAdr}, ${fnSym}`)
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
