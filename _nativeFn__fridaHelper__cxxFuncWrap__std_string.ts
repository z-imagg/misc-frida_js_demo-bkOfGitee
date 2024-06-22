
// [依赖] : InterceptFnSym.ts/NULL_num
// [描述] frida 通过本地助手函数 间接调用 c++ std::string 的new 、 delete
// 本地助手函数 fridaHelper__cxxFuncWrap__std_string_new 、 nativeFn__fridaHelper__cxxFuncWrap__std_string_delete





//frida中表达 函数 fridaHelper__cxxFuncWrap__std_string_new 的签名
// /fridaAnlzAp/frida_js_demo/app.cpp
// void* fridaHelper__cxxFuncWrap__std_string_new();
// void fridaHelper__cxxFuncWrap__std_string_delete(void* ptr_CxxStdString);
// objdump --syms app.elf | grep fridaHelper
// # 00000000000012f1 g     F .text	000000000000002b              _Z40fridaHelper__cxxFuncWrap__std_string_newv
// # 000000000000131c g     F .text	000000000000003e              _Z43fridaHelper__cxxFuncWrap__std_string_deletePv

//持有本地函数
let nativeFn__fridaHelper__cxxFuncWrap__std_string_new:NativeFunction<NativePointer,[]> ;  
//获取 本地函数 fridaHelper__cxxFuncWrap__std_string_new
function get__fridaHelper__cxxFuncWrap__std_string_new(){
    const fridaHelper__cxxFuncWrap__std_string_new:NativePointer = DebugSymbol.getFunctionByName("_Z40fridaHelper__cxxFuncWrap__std_string_newv");
    // void* fridaHelper__cxxFuncWrap__std_string_new();
    logWriteLn(`[frida_js, get__fridaHelper__cxxFuncWrap__std_string_new] fridaHelper__cxxFuncWrap__std_string_new=${fridaHelper__cxxFuncWrap__std_string_new}`)
    nativeFn__fridaHelper__cxxFuncWrap__std_string_new=  new NativeFunction(fridaHelper__cxxFuncWrap__std_string_new, 'pointer',[ ]);
    
    if(nativeFn__fridaHelper__cxxFuncWrap__std_string_new.toInt32()==NULL_num){
      throw new Error(`nativeFn__fridaHelper__cxxFuncWrap__std_string_delete为null`)
    }
}

//持有本地函数
let nativeFn__fridaHelper__cxxFuncWrap__std_string_delete:NativeFunction<void,[NativePointer]> ;  
//获取 本地函数 fridaHelper__cxxFuncWrap__std_string_delete
function get__fridaHelper__cxxFuncWrap__std_string_delete(){
    const fridaHelper__cxxFuncWrap__std_string_delete:NativePointer = DebugSymbol.getFunctionByName("_Z43fridaHelper__cxxFuncWrap__std_string_deletePv");
    // void fridaHelper__cxxFuncWrap__std_string_delete(void* ptr_CxxStdString);
    nativeFn__fridaHelper__cxxFuncWrap__std_string_delete=  new NativeFunction(fridaHelper__cxxFuncWrap__std_string_delete, 'void',[ 'pointer']);

    if(nativeFn__fridaHelper__cxxFuncWrap__std_string_delete.toInt32()==NULL_num){
      throw new Error(`nativeFn__fridaHelper__cxxFuncWrap__std_string_delete为null`)
    }

}

//持有本地函数
let nativeFn__fridaHelper__cxxFuncWrap__std_string_size:NativeFunction<number,[NativePointer]> ;  
//获取 本地函数 fridaHelper__cxxFuncWrap__std_string_size
function get__fridaHelper__cxxFuncWrap__std_string_size(){
    const fridaHelper__cxxFuncWrap__std_string_size:NativePointer = DebugSymbol.getFunctionByName("_Z41fridaHelper__cxxFuncWrap__std_string_sizePv");
    // int fridaHelper__cxxFuncWrap__std_string_size(void* ptr_CxxStdString);
    nativeFn__fridaHelper__cxxFuncWrap__std_string_size=  new NativeFunction(fridaHelper__cxxFuncWrap__std_string_size, 'int',[ 'pointer']);

    if(nativeFn__fridaHelper__cxxFuncWrap__std_string_size.toInt32()==NULL_num){
      throw new Error(`nativeFn__fridaHelper__cxxFuncWrap__std_string_delete为null`)
    }
}

//持有本地函数
let nativeFn__fridaHelper__cxxFuncWrap__std_string_cstr:NativeFunction<number,[NativePointer, number, NativePointer]> ;  
//获取 本地函数 fridaHelper__cxxFuncWrap__std_string_cstr
function get__fridaHelper__cxxFuncWrap__std_string_cstr(){
    const fridaHelper__cxxFuncWrap__std_string_cstr:NativePointer = DebugSymbol.getFunctionByName("_Z41fridaHelper__cxxFuncWrap__std_string_cstrPviPc");
    //int fridaHelper__cxxFuncWrap__std_string_cstr(void* ptr_CxxStdString, int cStrOutLen, char * cStrOut_);
    nativeFn__fridaHelper__cxxFuncWrap__std_string_cstr=  new NativeFunction(fridaHelper__cxxFuncWrap__std_string_cstr, 'int',[ 'pointer','int','pointer']);

    if(nativeFn__fridaHelper__cxxFuncWrap__std_string_cstr.toInt32()==NULL_num){
      throw new Error(`nativeFn__fridaHelper__cxxFuncWrap__std_string_delete为null`)
    }
}

/**   frida 通过助手函数 间接调用 c++ std::string 的new 、 delete
 */
function demoCall__nativeFn__fridaHelper__cxxFuncWrap__std_string_newThenDelete(  ){

  //调用本地函数 fridaHelper__cxxFuncWrap__std_string_new 
  if(nativeFn__fridaHelper__cxxFuncWrap__std_string_new.toInt32()!=NULL_num){

    //第1次调用
    const ptr_cxxStdString:NativePointer=nativeFn__fridaHelper__cxxFuncWrap__std_string_new( ) ;
    //等效于以下c++语句
    //  std::string * ptr_cxxStdString=fridaHelper__cxxFuncWrap__std_string_new();
    logWriteLn(`[frida_js, demoCall__nativeFn__fridaHelper__cxxFuncWrap__std_string_new] ptr_cxxStdString=${ptr_cxxStdString}`)

    if(nativeFn__fridaHelper__cxxFuncWrap__std_string_delete.toInt32()!=NULL_num){
      nativeFn__fridaHelper__cxxFuncWrap__std_string_delete(ptr_cxxStdString ) ;
    }


  }//end of if

}
