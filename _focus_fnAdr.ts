// [依赖] : 无

function focus_fnAdr(fnAdr:NativePointer,appName: string): boolean{
  //取得该地址的调试信息
  const fnSym=DebugSymbol.fromAddress(fnAdr);
  const moduleName = fnSym.moduleName

  //断言模块名非空
  if(moduleName==null){
    throw new Error(`【断言失败】moduleName为null`)
  }

  //不关注名为空的函数
  if (fnSym.name==null || fnSym.name==undefined){
    logWriteLn(`##不关注名为空的函数.fnAdr=[${fnAdr}]`)
    return false;
  }
  // logWriteLn(`@focus_fnAdr: moduleName=${moduleName}`)
  //若为主模块
  if(moduleName==appName   ){
    //跳过:
    if  ([ "func02_skip", "_init", "_start", "register_tm_clones", "frame_dummy", "__do_global_dtors_aux", "deregister_tm_clones", "_fini" ,
  // frida脚本中不跟踪被调用函数 func04_retVoid_outArgCharBuffer
    "func04_retVoid_outArgCharBuffer" 
  ].includes(fnSym.name)   )  {
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


