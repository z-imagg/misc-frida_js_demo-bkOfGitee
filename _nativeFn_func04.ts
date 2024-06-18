//_//fridaJs_Begin



//{结构体 'struct T_User'
const _C_Lang__sizeof_short=2; // sizeof(short)
//short字段 需 对齐到4字节
const C_Lang__sizeof_short=is4times(_C_Lang__sizeof_short)?_C_Lang__sizeof_short:near4times(_C_Lang__sizeof_short)
console.log(`C_Lang__sizeof_short=${C_Lang__sizeof_short}`)
const C_Lang__sizeof_float=4; // sizeof(float)
const C_Lang__sizeof_int=4; // sizeof(int)
let C_Lang__sizeof_structTUser:number=C_Lang__sizeof_short+C_Lang__sizeof_float+C_Lang__sizeof_int;


// ts的类Struct_TUser 表示 c结构体'struct T_User'
class Struct_TUser {
  userId: number;
  salary: number;
  sum: number;

  //将c结构体'struct T_User'转为ts的类Struct_TUser
  constructor(outArg_ptrStructUsr: NativePointer) {

    //结构体的第1个字段 'short userId' 指针
    const ptr_filed_userId:NativePointer=outArg_ptrStructUsr.add(0);
    //结构体的第2个字段 'float salary' 指针
    const ptr_filed_salary:NativePointer=ptr_filed_userId.add(C_Lang__sizeof_short);
    //结构体的第3个字段 'int sum' 指针
    const ptr_filed_sum:NativePointer=ptr_filed_salary.add(C_Lang__sizeof_float);
    
    //结构体的第1个字段   userId
    this.userId = ptr_filed_userId.readShort();
    //结构体的第2个字段   salary 
    this.salary = ptr_filed_salary.readFloat();
    //结构体的第3个字段   sum 
    this.sum = ptr_filed_sum.readInt();
  }
}
//}



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
    console.log(`[调用1] func04_ret_code=${func04_ret_code}`)
    // [调用1] func04_ret_code=0
    if(func04_ret_code==_OK){
      const ret_cstr:string|null=outArg_CharBuffer.readCString()
      if(ret_cstr){
        console.log(`[调用1] [frida] outArg_CharBuffer=[${ret_cstr}], ret_str.length=${ret_cstr.length}`)
        // [调用1] [frida] outArg_CharBuffer=[name:Zhangsan,id:4.000000,pi:17;zzzzzzzzzzzzz,hex:63,job_cnt:5,msg:hello_world,], ret_str.length=79
        //  结果正确
      }
    }

    //第2次调用
    func04_ret_code=nativeFn__func04_retVoid_outArgCharBuffer(-90909.2, -70070, outArg_CharBuffer) ;
    console.log(`[调用2] func04_ret_code=${func04_ret_code}`)
    // [调用2] func04_ret_code=0
    if(func04_ret_code==_OK){
      const ret_cstr:string|null=outArg_CharBuffer.readCString()
      if(ret_cstr){
        console.log(`[调用2] [frida] outArg_CharBuffer=[${ret_cstr}], ret_str.length=${ret_cstr.length}`)
        // [调用2] [frida] outArg_CharBuffer=[name:Zhangsan,id:-90909.200000,pi:-70070;zzzzzzzzzzzzz,hex:63,job_cnt:5,msg:hello_world,], ret_str.length=88
        //  结果正确
      }
    }

  }//end of if

}
