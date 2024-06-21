// [依赖] : 无
// [描述] 描述 本地函数 func01_return_int

//frida中表达 函数 func01_return_int 的签名
// int func01_return_int(char ch, double real_num);
type G_FnType_func01 = (ch: number, real_num: number) => number;
//持有本地函数
let g_nativeFn__func01_return_int:G_FnType_func01  |null;  




function demo_call_nativeFn_func01( ){

  //调用本地函数 func01_return_int
  if(g_nativeFn__func01_return_int){
    const ret_int:number=g_nativeFn__func01_return_int(32,-33); //结果应该是-9
    logWriteLn(`[nativeFn__func01_return_int],ret_int=[${ret_int}]`)
  } 


}//end of OnFnLeaveBusz

function get__func01_return_int(){

  //获取本地函数func01_return_int
  const func01_return_int:NativePointer = DebugSymbol.fromName("func01_return_int").address;
  g_nativeFn__func01_return_int=  new NativeFunction(func01_return_int, 'int',['char','double']);
  logWriteLn(`##nativeFn__func01_return_int=${g_nativeFn__func01_return_int}`)

}