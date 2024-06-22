// [依赖] : _logFile.ts/logWriteLn
// [描述] : clang-var插件中runtime c00中destroy函数json串出参 操纵

// const mg_abiName__cxxFunc06_outArgString:string="_Z22cxxFunc06_outArgStringiPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEE";
const mg_fnName__cxxFunc06_outArgString:string="cxxFunc06_outArgString";

enum FnArgIdx_Fn06{
// cxxFunc06_outArgString 函数签名
// /fridaAnlzAp/frida_js_demo/app.cpp
// bool cxxFunc06_outArgString(int num,  std::string * numDescOut_);
    num=0,
    numDescOut_=1,
    // arg2Name=2, //这一行是举例而已，此函数只有以上两个参数
}

//clang-var插件中runtime c00中destroy函数json串出参 操纵.
class CxxFnOutArg_stdString__Fn06{

  //  /fridaAnlzAp/frida_js_demo/app.cpp / fridaHelper__cxxFuncWrap__std_string_cstr / _Err1 == 1
  static  stdStr_2_fridaBuf__Err1:number = 1;
  //  /fridaAnlzAp/frida_js_demo/app.cpp / fridaHelper__cxxFuncWrap__std_string_cstr / _OK == 0
  static  stdStr_2_fridaBuf__OK:number = 0;
  //  /fridaAnlzAp/frida_js_demo/app.cpp / fridaHelper__cxxFuncWrap__std_string_cstr / _stdStr_2_fridaBuf_gap == 11
  static   stdStr_2_fridaBuf_gap:number = 11;

  int__num:number
  ptrCxxStdStr__numDescOut_:NativePointer
    
  static Enter(
    args:InvocationArguments,
    _int__num:number,
  ):CxxFnOutArg_stdString__Fn06|null{

  let  _ptrCxxStdStr__numDescOut_:NativePointer;
    //调用本地函数 fridaHelper__cxxFuncWrap__std_string_new 
    _ptrCxxStdStr__numDescOut_=nativeFn__fridaHelper__cxxFuncWrap__std_string_new( ) ;
    //等效c++语句为
    //std::string* _ptrCxxStdStr__numDescOut_=new std::string()

    logWriteLn(`[frida_js Fn05OutArg.Enter] _ptrCxxStdStr__numDescOut_=[${_ptrCxxStdStr__numDescOut_}]`); 
    
    if(_ptrCxxStdStr__numDescOut_){
      return new CxxFnOutArg_stdString__Fn06(args, _int__num  ,_ptrCxxStdStr__numDescOut_);
    }

  return null;

  }
    
//给出参赋以全局内存空间
  constructor(
    args:InvocationArguments,
    _int__num:number,
    _ptrCxxStdStr__numDescOut_:NativePointer
  ){

    // args[1].toInt32() // == num
    args[FnArgIdx_Fn06.num]=new NativePointer(_int__num);// 修改 输入参数 num 为 _int__num
    this.int__num=_int__num
    logWriteLn(`[frida_js Fn05OutArg.constructor] num=[${_int__num}]`); 
    
    // args[2].readCString() // == numDescOut_
    args[FnArgIdx_Fn06.numDescOut_]=_ptrCxxStdStr__numDescOut_ // 修改此次函数调用 出参 numDescOut_ 为 _ptrCxxStdStr__numDescOut_
    this.ptrCxxStdStr__numDescOut_=_ptrCxxStdStr__numDescOut_ //保留 之
    
    }
  
  //拿出参内容
  Leave(){
    //现在是函数离开时, 由于函数进入时 参数们args[k]被保存在thiz下, 因此此时可以拿出来
    logWriteLn(`[frida_js Fn05OutArg.Leave] json(this)=[${JSON.stringify(this)}]`);

// cxxFunc06_outArgString 函数签名
// /fridaAnlzAp/frida_js_demo/app.cpp
// bool cxxFunc06_outArgString(int num,  std::string * numDescOut_);
    
    //this.int__num // == num
    logWriteLn(`[frida_js  Fn05OutArg.Leave] int__num=[${this.int__num}]`); 

    //函数离开时, 获取到 函数出参 numDescOut_
    if(this.ptrCxxStdStr__numDescOut_){
        //调用std::string::size方法
        const stdStr_size:number=nativeFn__fridaHelper__cxxFuncWrap__std_string_size(this.ptrCxxStdStr__numDescOut_)
        //为cstr分配缓冲区
        const cStrBuf:NativePointer=Memory.alloc(stdStr_size+CxxFnOutArg_stdString__Fn06.stdStr_2_fridaBuf_gap+1);
        //调用std::string::c_str方法
        const retCode:number=nativeFn__fridaHelper__cxxFuncWrap__std_string_cstr(this.ptrCxxStdStr__numDescOut_, stdStr_size, cStrBuf);
        if(retCode==CxxFnOutArg_stdString__Fn06.stdStr_2_fridaBuf__OK){
          const numDescOut_CStr:string| null=cStrBuf.readCString() // == numDescOut_
          if(numDescOut_CStr){
            logWriteLn(`[frida_js  CxxFnOutArg_stdString__Fn06.Leave] numDescOut_CStr=[${numDescOut_CStr}]`);
          }
        }
        //等效 c++语句为 delete ptrCxxStdStr__numDescOut_
        nativeFn__fridaHelper__cxxFuncWrap__std_string_delete(this.ptrCxxStdStr__numDescOut_ ) ;
    }
    
    }
    
    }