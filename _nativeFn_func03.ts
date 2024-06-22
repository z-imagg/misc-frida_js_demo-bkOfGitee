
// [依赖] : 无
// [描述] 描述 本地函数 func03_retVoid_outArgPtrStructUser


//{结构体 'struct T_User'
const _C_Lang__sizeof_short=2; // sizeof(short)
//short字段 需 对齐到4字节
const C_Lang__sizeof_short=is4times(_C_Lang__sizeof_short)?_C_Lang__sizeof_short:near4times(_C_Lang__sizeof_short)
logWriteLn(`C_Lang__sizeof_short=${C_Lang__sizeof_short}`)
const C_Lang__sizeof_float=4; // sizeof(float)
// const C_Lang__sizeof_int=4; // sizeof(int)
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



//frida中表达 函数 func03_retVoid_outArgPtrStructUser 的签名
// void func03_retVoid_outArgPtrStructUser(int _userId, char sex, struct T_User* outArg_ptrStructUsr)
//持有本地函数
let nativeFn__func03_retVoid_outArgPtrStructUser:NativeFunction<void,[number,number,NativePointer]> ;  

//获取 本地函数 func03_retVoid_outArgPtrStructUser
function get__func03_retVoid_outArgPtrStructUser(){
  //获取 本地函数 func03_retVoid_outArgPtrStructUser
  const func03_retVoid_outArgPtrStructUser:NativePointer = DebugSymbol.fromName("func03_retVoid_outArgPtrStructUser").address;
  nativeFn__func03_retVoid_outArgPtrStructUser=  new NativeFunction(func03_retVoid_outArgPtrStructUser, 'void',['int','char','pointer']); //函数返回类型中无法表达 自定义结构体 T_User, 因此只能用 指针参数携带返回结构体
  /* frida网站 2019年 有人提出了改进需求 将    "C structs" 和  JavaScript objects 做对应 ，但该需求始终是Open的， 这说明frida目前无法调用 调用返回类型为 结构体的本地c函数
  Map between "C structs" and JavaScript objects #1099  
https://github.com/frida/frida/issues/1099

  */
  logWriteLn(`##nativeFn__func03_retVoid_outArgPtrStructUser=${nativeFn__func03_retVoid_outArgPtrStructUser}`)

}

/**  调用本地函数 func03 例子
 */
function demo_call_nativeFn_func03(  ){

  //调用本地函数 func03_retVoid_outArgPtrStructUser
  if(nativeFn__func03_retVoid_outArgPtrStructUser.toInt32()!=NULL_num){
    const outArg_ptrStructUsr:NativePointer=Memory.alloc(C_Lang__sizeof_structTUser);
    //指针参数outArg_ptrStructUsr携带返回结构体
    nativeFn__func03_retVoid_outArgPtrStructUser.call(null,4,M_ascii,outArg_ptrStructUsr) ;
    //将c结构体'struct T_User'转为ts的类Struct_TUser
    const retStructTUser=new Struct_TUser(outArg_ptrStructUsr)
    logWriteLn(`[outArg_ptrStructUsr],{userId=${retStructTUser.userId},salary=${retStructTUser.salary}, sum=${retStructTUser.sum} }`)
    // {userId=204,salary=3000.10009765625, sum=-123 }, 结果正确
  }

}
