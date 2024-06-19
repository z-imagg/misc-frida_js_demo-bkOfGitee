
// [依赖] : 无
// [描述] 描述 本地函数 func04_retVoid_outArgCharBuffer





//frida中表达 函数 func04_retVoid_outArgCharBuffer 的签名
// int func04_retVoid_outArgCharBuffer(double _doubleNum, long _longInt, char* outArg_CharBuffer)
//持有本地函数
let nativeFn__func04_retVoid_outArgCharBuffer:NativeFunction<number,[number,number,NativePointer]> ;  

//获取 本地函数 func04_retVoid_outArgCharBuffer
function get__func04_retVoid_outArgCharBuffer(){
    const func04_retVoid_outArgCharBuffer:NativePointer = DebugSymbol.fromName("func04_retVoid_outArgCharBuffer").address;
    // int func04_retVoid_outArgCharBuffer(double _doubleNum, long _longInt, char* outArg_CharBuffer)
    nativeFn__func04_retVoid_outArgCharBuffer=  new NativeFunction(func04_retVoid_outArgCharBuffer, 'int',['double','long','pointer']);
}

const _Concat_Limit:number =50
const _Concat_CntTop:number =4
const _Buffer_Limit:number=  _Concat_CntTop * _Concat_Limit
// frida中的alloc内存会被垃圾回收, 理论上不必作为全局量，但写作全局变量更合理？
const outArg_CharBuffer:NativePointer=Memory.alloc(_Buffer_Limit);
const _OK = 0
const NULL_num=NULL.toInt32();

/**  调用本地函数 func04 例子
 */
function demo_call_nativeFn_func04(  ){

  //调用本地函数 func04_retVoid_outArgCharBuffer
  if(nativeFn__func04_retVoid_outArgCharBuffer.toInt32()!=NULL_num){
    //指针参数outArg_CharBuffer携带返回字符串
    //     int func04_ret_code=func04_retVoid_outArgCharBuffer(4.0, 17, CharBuffer);

    //第1次调用
    let func04_ret_code:number=nativeFn__func04_retVoid_outArgCharBuffer(4.0,17,outArg_CharBuffer) ;
    logWriteLn(`[调用1] func04_ret_code=${func04_ret_code}`)
    // [调用1] func04_ret_code=0
    if(func04_ret_code==_OK){
      const ret_cstr:string|null=outArg_CharBuffer.readCString()
      if(ret_cstr){
        logWriteLn(`[调用1] [frida] outArg_CharBuffer=[${ret_cstr}], ret_str.length=${ret_cstr.length}`)
        // [调用1] [frida] outArg_CharBuffer=[name:Zhangsan,id:4.000000,pi:17;zzzzzzzzzzzzz,hex:63,job_cnt:5,msg:hello_world,], ret_str.length=79
        //  结果正确
      }
    }

    //第2次调用
    func04_ret_code=nativeFn__func04_retVoid_outArgCharBuffer(-90909.2, -70070, outArg_CharBuffer) ;
    logWriteLn(`[调用2] func04_ret_code=${func04_ret_code}`)
    // [调用2] func04_ret_code=0
    if(func04_ret_code==_OK){
      const ret_cstr:string|null=outArg_CharBuffer.readCString()
      if(ret_cstr){
        logWriteLn(`[调用2] [frida] outArg_CharBuffer=[${ret_cstr}], ret_str.length=${ret_cstr.length}`)
        // [调用2] [frida] outArg_CharBuffer=[name:Zhangsan,id:-90909.200000,pi:-70070;zzzzzzzzzzzzz,hex:63,job_cnt:5,msg:hello_world,], ret_str.length=88
        //  结果正确
      }
    }

  }//end of if

}
