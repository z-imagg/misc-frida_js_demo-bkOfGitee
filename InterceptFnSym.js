const g_appName = "app.elf";
function focus_fnAdr(fnAdr) {
    //取得该地址的调试信息
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    const moduleName = fnSym.moduleName;
    //断言模块名非空
    if (moduleName == null) {
        throw new Error(`【断言失败】moduleName为null`);
    }
    //不关注名为空的函数
    if (fnSym.name == null || fnSym.name == undefined) {
        console.log(`##不关注名为空的函数.fnAdr=[${fnAdr}]`);
        return false;
    }
    //若为主模块
    if (moduleName == g_appName) {
        //跳过:
        if (["func02_skip", "_init", "_start", "register_tm_clones", "frame_dummy", "__do_global_dtors_aux", "deregister_tm_clones", "_fini",
            // frida脚本中不跟踪被调用函数 func04_retVoid_outArgCharBuffer
            "func04_retVoid_outArgCharBuffer"
        ].includes(fnSym.name)) {
            return false;
        }
        //关注:
        else {
            return true;
        }
    }
    //若为其他模块
    if (moduleName == "other.so") {
        // 'if ... return' 只关注给定条件, 不需要 全局条件 'return ...'   
        //跳过:
        if (fnSym.name == "func_other") {
            return false;
        }
    }
    //其他情况 跳过
    return false;
}
//填充函数符号表格
function findFnDbgSym(fnAdr) {
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    return fnSym;
}
/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz, args) {
    const curThreadId = Process.getCurrentThreadId();
    const fnAdr = thiz.context.pc;
    const fnSym = findFnDbgSym(fnAdr);
    console.log(`[OnFnEnterBusz],fnSym=[${fnSym}]`);
    thiz.fnAdr_OnFnEnterBusz = fnAdr;
}
//{4字节对齐 工具函数
function is4times(n) {
    const is_ = Math.floor(n / 4) * 4 == n;
    return is_;
}
function near4times(n) {
    const near = Math.floor((n + (4 - 1)) / 4) * 4;
    return near;
}
//}
//{结构体 'struct T_User'
const _C_Lang__sizeof_short = 2; // sizeof(short)
//short字段 需 对齐到4字节
const C_Lang__sizeof_short = is4times(_C_Lang__sizeof_short) ? _C_Lang__sizeof_short : near4times(_C_Lang__sizeof_short);
console.log(`C_Lang__sizeof_short=${C_Lang__sizeof_short}`);
const C_Lang__sizeof_float = 4; // sizeof(float)
const C_Lang__sizeof_int = 4; // sizeof(int)
let C_Lang__sizeof_structTUser = C_Lang__sizeof_short + C_Lang__sizeof_float + C_Lang__sizeof_int;
// ts的类Struct_TUser 表示 c结构体'struct T_User'
class Struct_TUser {
    //将c结构体'struct T_User'转为ts的类Struct_TUser
    constructor(outArg_ptrStructUsr) {
        //结构体的第1个字段 'short userId' 指针
        const ptr_filed_userId = outArg_ptrStructUsr.add(0);
        //结构体的第2个字段 'float salary' 指针
        const ptr_filed_salary = ptr_filed_userId.add(C_Lang__sizeof_short);
        //结构体的第3个字段 'int sum' 指针
        const ptr_filed_sum = ptr_filed_salary.add(C_Lang__sizeof_float);
        //结构体的第1个字段   userId
        this.userId = ptr_filed_userId.readShort();
        //结构体的第2个字段   salary 
        this.salary = ptr_filed_salary.readFloat();
        //结构体的第3个字段   sum 
        this.sum = ptr_filed_sum.readInt();
    }
}
//持有本地函数
let nativeFn__func01_return_int;
//frida中表达 函数 func03_retVoid_outArgPtrStructUser 的签名
// void func03_retVoid_outArgPtrStructUser(int _userId, char sex, struct T_User* outArg_ptrStructUsr)
//持有本地函数
let nativeFn__func03_retVoid_outArgPtrStructUser;
const M_ascii = 'M'.charCodeAt(0);
//frida中表达 函数 func04_retVoid_outArgCharBuffer 的签名
// int func04_retVoid_outArgCharBuffer(double _doubleNum, long _longInt, char* outArg_CharBuffer)
//持有本地函数
let nativeFn__func04_retVoid_outArgCharBuffer;
const _Concat_Limit = 50;
const _Concat_CntTop = 4;
const _Buffer_Limit = _Concat_CntTop * _Concat_Limit;
// frida中的alloc内存会被垃圾回收, 理论上不必作为全局量，但写作全局变量更合理？
const outArg_CharBuffer = Memory.alloc(_Buffer_Limit);
const _OK = 0;
const NULL_num = NULL.toInt32();
/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz, retval) {
    const curThreadId = Process.getCurrentThreadId();
    const fnAdr = thiz.context.pc;
    const fnSym = findFnDbgSym(fnAdr);
    if (fnAdr.readInt() != thiz.fnAdr_OnFnEnterBusz.readInt()) {
        console.log(`##错误，进出函数地址不同`);
    }
    console.log(`[OnFnLeaveBusz],fnSym=[${fnSym}]`);
    //调用本地函数 func01_return_int
    if (nativeFn__func01_return_int) {
        const ret_int = nativeFn__func01_return_int(32, -33); //结果应该是-9
        console.log(`[nativeFn__func01_return_int],ret_int=[${ret_int}]`);
    }
    //调用本地函数 func03_retVoid_outArgPtrStructUser
    if (nativeFn__func03_retVoid_outArgPtrStructUser.toInt32() != NULL_num) {
        const outArg_ptrStructUsr = Memory.alloc(C_Lang__sizeof_structTUser);
        //指针参数outArg_ptrStructUsr携带返回结构体
        nativeFn__func03_retVoid_outArgPtrStructUser.call(null, 4, M_ascii, outArg_ptrStructUsr);
        //将c结构体'struct T_User'转为ts的类Struct_TUser
        const retStructTUser = new Struct_TUser(outArg_ptrStructUsr);
        console.log(`[outArg_ptrStructUsr],{userId=${retStructTUser.userId},salary=${retStructTUser.salary}, sum=${retStructTUser.sum} }`);
        // {userId=204,salary=3000.10009765625, sum=-123 }, 结果正确
    }
    //调用本地函数 func04_retVoid_outArgCharBuffer
    if (nativeFn__func04_retVoid_outArgCharBuffer.toInt32() != NULL_num) {
        //指针参数outArg_CharBuffer携带返回字符串
        //     int func04_ret_code=func04_retVoid_outArgCharBuffer(4.0, 17, CharBuffer);
        //第1次调用
        let func04_ret_code = nativeFn__func04_retVoid_outArgCharBuffer(4.0, 17, outArg_CharBuffer);
        console.log(`[调用1] func04_ret_code=${func04_ret_code}`);
        // [调用1] func04_ret_code=0
        if (func04_ret_code == _OK) {
            const ret_cstr = outArg_CharBuffer.readCString();
            if (ret_cstr) {
                console.log(`[调用1] [frida] outArg_CharBuffer=[${ret_cstr}], ret_str.length=${ret_cstr.length}`);
                // [调用1] [frida] outArg_CharBuffer=[name:Zhangsan,id:4.000000,pi:17;zzzzzzzzzzzzz,hex:63,job_cnt:5,msg:hello_world,], ret_str.length=79
                //  结果正确
            }
        }
        //第2次调用
        func04_ret_code = nativeFn__func04_retVoid_outArgCharBuffer(-90909.2, -70070, outArg_CharBuffer);
        console.log(`[调用2] func04_ret_code=${func04_ret_code}`);
        // [调用2] func04_ret_code=0
        if (func04_ret_code == _OK) {
            const ret_cstr = outArg_CharBuffer.readCString();
            if (ret_cstr) {
                console.log(`[调用2] [frida] outArg_CharBuffer=[${ret_cstr}], ret_str.length=${ret_cstr.length}`);
                // [调用2] [frida] outArg_CharBuffer=[name:Zhangsan,id:-90909.200000,pi:-70070;zzzzzzzzzzzzz,hex:63,job_cnt:5,msg:hello_world,], ret_str.length=88
                //  结果正确
            }
        }
    } //end of if
} //end of OnFnLeaveBusz
function _main_() {
    //获取本地函数func01_return_int
    const func01_return_int = DebugSymbol.fromName("func01_return_int").address;
    nativeFn__func01_return_int = new NativeFunction(func01_return_int, 'int', ['char', 'double']);
    console.log(`##nativeFn__func01_return_int=${nativeFn__func01_return_int}`);
    //获取 本地函数 func03_retVoid_outArgPtrStructUser
    const func03_retVoid_outArgPtrStructUser = DebugSymbol.fromName("func03_retVoid_outArgPtrStructUser").address;
    nativeFn__func03_retVoid_outArgPtrStructUser = new NativeFunction(func03_retVoid_outArgPtrStructUser, 'void', ['int', 'char', 'pointer']); //函数返回类型中无法表达 自定义结构体 T_User, 因此只能用 指针参数携带返回结构体
    /* frida网站 2019年 有人提出了改进需求 将    "C structs" 和  JavaScript objects 做对应 ，但该需求始终是Open的， 这说明frida目前无法调用 调用返回类型为 结构体的本地c函数
    Map between "C structs" and JavaScript objects #1099
  https://github.com/frida/frida/issues/1099
  
    */
    console.log(`##nativeFn__func03_retVoid_outArgPtrStructUser=${nativeFn__func03_retVoid_outArgPtrStructUser}`);
    //获取 本地函数 func04_retVoid_outArgCharBuffer
    const func04_retVoid_outArgCharBuffer = DebugSymbol.fromName("func04_retVoid_outArgCharBuffer").address;
    // int func04_retVoid_outArgCharBuffer(double _doubleNum, long _longInt, char* outArg_CharBuffer)
    nativeFn__func04_retVoid_outArgCharBuffer = new NativeFunction(func04_retVoid_outArgCharBuffer, 'int', ['double', 'long', 'pointer']);
    const fnAdrLs = DebugSymbol.findFunctionsMatching("*");
    console.log(`fnAdrLs.length=${fnAdrLs.length}`);
    const fnAdrCnt = fnAdrLs.length;
    for (let [k, fnAdr] of fnAdrLs.entries()) {
        if (!focus_fnAdr(fnAdr)) {
            continue;
        }
        const fnSym = DebugSymbol.fromAddress(fnAdr);
        console.log(`关注函数 ${fnAdr}, ${fnSym}`);
        Interceptor.attach(fnAdr, {
            onEnter: function (args) {
                OnFnEnterBusz(this, args);
            },
            onLeave: function (retval) {
                OnFnLeaveBusz(this, retval);
            }
        });
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
