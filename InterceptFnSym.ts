//MyTsBegin//主ts文件开始标记


// 导入 _msic_util.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_msic_util.ts" , curNextLn)

// 以命令MyTsCmd从配置文件config.json读取应用程序名 填充到下一行
//MyTsCmd//_replaceSubStrInNextLine('{}' ,  readTxtFile("./config.json") , curNextLn )
const g_cfg:{[key:string]:string} =  {};
const g_appPath: string = g_cfg["appPath"];
const g_appArgLsAsTxt: string = g_cfg["appArgLsAsTxt"];
const g_appName: string =baseNameOfFilePath(g_appPath);

// 以命令MyTsCmd导入文件 _DateTime_util.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_DateTime_util.ts" , curNextLn)

// 以命令MyTsCmd导入文件 _logFile.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_logFile.ts" , curNextLn)


const C_Lang__sizeof_int=4; // sizeof(int)

//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer):DebugSymbol {
  const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr);
  return fnSym
}

function get_ascii(char_:string):number{
  if(!char_ || char_.length!=1){
    throw new Error(`[get_ascii] 入参错误，非单字符,char_=[${char_}]`);
  }
  const ascii:number= char_.charCodeAt(0);
  return ascii;
}
function to_ascii(ascii:number):string{
  const char_:string=String.fromCharCode(ascii);
  return char_;
}


const _UserName1_Limit:number = 48;
const g_buf:NativePointer=Memory.alloc(_UserName1_Limit-1)
const g_int:NativePointer=Memory.alloc(C_Lang__sizeof_int);

enum Fn05ArgIdx{
// func05_userQuery 函数签名
// /fridaAnlzAp/frida_js_demo/app.c
// float func05_userQuery(char sex, int userId, int userName_limit, char* userName_out_, int* userName_length_out_);
  sex=0,
  userId=1,
  userName_limit=2,
  userName_out_=3,
  userName_length_out_=4
}
class Fn05OutArg{
  
  int__userName_limit:number
  charArr__userName_out_:NativePointer
  intPtr_userName_length_out_:NativePointer

  static Enter(args:InvocationArguments,
    _int__userName_limit:number,
    _charArr__userName_out_:NativePointer,
    _intPtr_userName_length_out_:NativePointer){
      return new Fn05OutArg(args, _int__userName_limit, _charArr__userName_out_,_intPtr_userName_length_out_);
  }

//进入函数func05_userQuery的处理
  constructor(args:InvocationArguments,
     _int__userName_limit:number,
     _charArr__userName_out_:NativePointer,
     _intPtr_userName_length_out_:NativePointer
     ){


// const arg0_toInt32:number=args[0].toInt32() // ==  sex

// const arg1_toInt32:number=args[1].toInt32() // == userId

// args[2].toInt32() // == userName_limit
args[Fn05ArgIdx.userName_limit]=new NativePointer(_int__userName_limit);// 修改 输入参数 userName_limit 为 _int__userName_limit
logWriteLn(`[frida_js Fn05OutArg_constructor] userName_limit=[${_int__userName_limit}]`); 
this.int__userName_limit=_int__userName_limit

// const arg3_readCString:string| null=args[3].readCString() // == userName_out_
args[Fn05ArgIdx.userName_out_]=_charArr__userName_out_ // 修改 入参 userName_out_ 为 _charArr__userName_out_
logWriteLn(`[frida_js Fn05OutArg_constructor] userName_out_=[${_charArr__userName_out_}]`); 
this.charArr__userName_out_=_charArr__userName_out_ //保留 之

// const arg4_readInt:number=args[4].readInt() // == userName_length_out_
args[Fn05ArgIdx.userName_length_out_]=_intPtr_userName_length_out_ // 修改 入参 userName_length_out_ 为 _intPtr_userName_length_out_
logWriteLn(`[frida_js Fn05OutArg_constructor] userName_length_out_=[${_intPtr_userName_length_out_}]`); 
this.intPtr_userName_length_out_=_intPtr_userName_length_out_ //保留 之
}

//离开函数func05_userQuery的处理
  Leave(){
  //现在是函数离开时, 由于函数进入时 参数们args[k]被保存在thiz下, 因此此时可以拿出来
  // const userName_limit:NativePointer=this.int__userName_limit
  const userName_out_:NativePointer=this.charArr__userName_out_
  const userName_length_out_:NativePointer=this.intPtr_userName_length_out_
  logWriteLn(`[frida_js Fn05OutArg Leave] json(this)=[${JSON.stringify(this)}]`);

  // func05_userQuery 函数签名
  // /fridaAnlzAp/frida_js_demo/app.c
  // float func05_userQuery(char sex, int userId, int userName_limit, char* userName_out_, int* userName_length_out_);
  
  const arg2_toInt32:number=this.int__userName_limit // == userName_limit
  logWriteLn(`[frida_js  Fn05OutArg Leave] arg2_toInt32=[${arg2_toInt32}]`); 

  //函数离开时, 获取到 函数出参 userName_out_
  const arg3_readCString:string| null=this.charArr__userName_out_.readCString() // == userName_out_
  if(arg3_readCString){
    logWriteLn(`[frida_js  Fn05OutArg Leave] arg3_readCString=[${arg3_readCString}]`);
  }
  
  //函数离开时, 获取到 函数出参 userName_length_out_
  const arg4_readInt:number=this.intPtr_userName_length_out_.readInt() // == userName_length_out_
  logWriteLn(`[frida_js  Fn05OutArg Leave] arg4_readInt=[${arg4_readInt}]`);
  userName_length_out_.writeInt(-88); // 修改 输入参数 userName_length_out_ 为 -88; 这句是为了实验，并无业务目的
  }

}


/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz:InvocationContext,  args:InvocationArguments){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const fnAdr:NativePointer=thiz.context.pc;
  const fnSym :DebugSymbol|undefined= findFnDbgSym(fnAdr)
  logWriteLn(`[OnFnEnterBusz],fnSym=[${fnSym}]`)
  thiz.fnAdr_OnFnEnterBusz=fnAdr;

  logWriteLn(`fnSym=${JSON.stringify(fnSym)}`)
  //对函数func05_userQuery的特殊处理
  if(fnSym && fnSym.name=="func05_userQuery"){
    logWriteLn(`before func05OutArg_Enter`); 
    thiz.func05OutArg=Fn05OutArg.Enter(args,_UserName1_Limit,g_buf,g_int);
    logWriteLn(`after func05OutArg_Enter`); 
    //走到这里了
  }



}

// 以命令MyTsCmd导入文件 _tool.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_tool.ts" , curNextLn)

// 以命令MyTsCmd导入文件 _nativeFn_func01.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_nativeFn_func01.ts" , curNextLn)

// 以命令MyTsCmd导入文件 _nativeFn_func03.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_nativeFn_func03.ts" , curNextLn)

// 以命令MyTsCmd导入文件 _nativeFn_func04.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_nativeFn_func04.ts" , curNextLn)

const M_ascii:number='M'.charCodeAt(0);

/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz:InvocationContext,  retval:InvocationReturnValue ){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const fnAdr:NativePointer=thiz.context.pc;
  const fnSym :DebugSymbol|undefined= findFnDbgSym(fnAdr)
  if(fnAdr.readInt()!=thiz.fnAdr_OnFnEnterBusz.readInt()){
    logWriteLn(`##错误，进出函数地址不同`)
  }
  logWriteLn(`[OnFnLeaveBusz],fnSym=[${fnSym}]`)

  //调用本地函数 func01_return_int
  demo_call_nativeFn_func01(  );

  //调用本地函数 func03_retVoid_outArgPtrStructUser
  demo_call_nativeFn_func03(  );

  //调用本地函数 func04_retVoid_outArgCharBuffer
  // demo_call_nativeFn_func04(  );

    //对函数func05_userQuery的特殊处理
  if(fnSym && fnSym.name=="func05_userQuery"){
    //没有走到这里
    logWriteLn(`before func05OutArg.Leave`); 
    thiz.func05OutArg.Leave()
    logWriteLn(`after func05OutArg.Leave`); 
  }

}//end of OnFnLeaveBusz

// '包装' 使用了  '实现' 和 '配置'
// '配置' 使用了  '实现'
// 导入 '模块的函数名过滤器 实现 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_focus_fnAdr/_impl.ts" , curNextLn)
// 导入 '模块的函数名过滤器 配置 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_focus_fnAdr/_config.ts" , curNextLn)
// 导入 '模块的函数名过滤器 包装 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_focus_fnAdr/_wrap.ts" , curNextLn)


function _main_(){

  //获取本地函数 func01_return_int
  get__func01_return_int();


  //获取 本地函数 func03_retVoid_outArgPtrStructUser
  get__func03_retVoid_outArgPtrStructUser();

  //获取 本地函数 func04_retVoid_outArgCharBuffer
  get__func04_retVoid_outArgCharBuffer();


  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  logWriteLn(`fnAdrLs.length=${fnAdrLs.length}`)
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    if(!focus_fnAdr(fnAdr)){
      continue;
    }

    const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr)
    logWriteLn(`##${nowTxt()}; [关注函数]; fnAdr=${fnAdr}, fnSym.json= ${JSON.stringify(fnSym)}`)
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
