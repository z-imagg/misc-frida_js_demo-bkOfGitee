#include <string>
#include <stdio.h>

bool cxxFunc06_outArgString(int num,  std::string * numDescOut_){
    if(num>=0){
        numDescOut_->assign("PositiveOrZeroNum");
    }else{
        numDescOut_->assign("NegtiveNum");
    }
    return true;
}


int main(int argc,char** argv){
    std::string numDesc;
    cxxFunc06_outArgString(31, nullptr);
    cxxFunc06_outArgString(-120, nullptr);
    return 0;
}

/** 供给frida用的cxx std::string构造函数 包装器
 * 
 * cxx std::string 构造函数 返回类型 理论上 应该是 std::string ， 而 frida 的NativeFunction貌似不支持表达 自定义struct、自定义class
 * 因此只能包装
 
objdump --syms app.elf | grep fridaHelper
# 00000000000012f1 g     F .text	000000000000002b              _Z40fridaHelper__cxxFuncWrap__std_string_newv
# 000000000000131c g     F .text	000000000000003e              _Z43fridaHelper__cxxFuncWrap__std_string_deletePv
*/
void* fridaHelper__cxxFuncWrap__std_string_new(){
    std::string *ptr= new std::string();
    printf("[app.cpp, fridaHelper__cxxFuncWrap__std_string_new] ptr=%x\n",ptr);
    return ptr;
}
void fridaHelper__cxxFuncWrap__std_string_delete(void* ptr_CxxStdString){
    std::string* ptr=(std::string*)(ptr_CxxStdString);
    delete ptr;
}
