// [描述] 模块的函数名过滤器 实现
// [依赖] : 无
// [术语] : focuse == 关注,  not_focuse == 不关注 == 讨厌, include == 包含, exclude == 排除
//            包含 对应 关注, 
//            排除 对应 不关注

/**
ldd /app/可执行elf文件路径
        linux-vdso.so.1 (0x00007ffff7fc1000)
        libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007ffff6323000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ffff60fa000)
        /lib64/ld-linux-x86-64.so.2 (0x00007ffff7fc3000)
        libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007ffff608a000)
        其他被依赖的so们
*/

//默认行文枚举: 包括 或 排除
enum MG_Enum_DefaultAct{
  // 包括 
  //   包含 对应 关注
  Include = 1,
  // 排除
  //   排除 对应 讨厌
  Exclude = 2,
}
const MG_Enum_DefaultAct__Values:number[]=[ MG_Enum_DefaultAct.Exclude, MG_Enum_DefaultAct.Include] ;
//断言是合法枚举
function assertIsValidEnum_DefaultAct(defaultAct:number):void{
  if(!MG_Enum_DefaultAct__Values.includes (defaultAct) ){
    throw new Error(`[枚举量取值不合法] defaultAct[${defaultAct}] , 而MG_Enum_DefaultAct允许的列表为{${MG_Enum_DefaultAct__Values}}`)
  }
}

//关注==不讨厌
const _FOCUS:boolean=true;
//讨厌==不关注
const _NOT_FOCUS:boolean=false;

class MG_ModuleFilter{

  //关注该模块中的一些函数
  static build_includeFuncLs(moduleName:string, fnNameLs_include:string[]){
    return new MG_ModuleFilter(moduleName, MG_Enum_DefaultAct.Include,fnNameLs_include, []);
  }
  
  //讨厌该模块中的一些函数
  static build_excludeFuncLs(moduleName:string, fnNameLs_exclude:string[]){
    return new MG_ModuleFilter(moduleName, MG_Enum_DefaultAct.Exclude,[], fnNameLs_exclude);
  }

  //讨厌该模块中的全部函数
  static build_excludeAllFunc(moduleName:string){
    return new MG_ModuleFilter(moduleName, MG_Enum_DefaultAct.Exclude,[], []);
  }
  
  //给定模块们, 讨厌任意一个模块的全部函数
  static build_excludeAllFunc_moduleLs(moduleName_ls:string[]){
    const filterLs:MG_ModuleFilter[] = moduleName_ls.map((moduleNameK)=>{
      return MG_ModuleFilter.build_excludeAllFunc(moduleNameK)
    });
    return filterLs;
  }

  //关注该模块中的全部函数
  static build_includeAllFunc(moduleName:string){
    return new MG_ModuleFilter(moduleName, MG_Enum_DefaultAct.Include,[], []);
  }
  
  //给定模块们, 关注任意一个模块的全部函数
  static build_includeAllFunc_moduleLs(moduleName_ls:string[]){
    const filterLs:MG_ModuleFilter[] = moduleName_ls.map((moduleNameK)=>{
      return MG_ModuleFilter.build_includeAllFunc(moduleNameK)
    });
    return filterLs;
  }


moduleName:string;
defaultAct:MG_Enum_DefaultAct;
fnNameLs_include:string[];
fnNameLs_exclude:string[];

constructor (moduleName:string, defaultAct:MG_Enum_DefaultAct, fnNameLs_include:string[], fnNameLs_exclude:string[]){
  //断言是合法枚举
  assertIsValidEnum_DefaultAct(defaultAct);

  this.moduleName=moduleName;
  this.defaultAct = defaultAct;
  this.fnNameLs_include=fnNameLs_include;
  this.fnNameLs_exclude=fnNameLs_exclude;


}

focus(fnAdr:NativePointer):boolean{
  const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr);
  const fnName:string|null=fnSym.name;

  const moduleName = fnSym.moduleName
  if(moduleName==null){
    throw new Error(`[无模块名错误][疑似无该函数] DebugSymbol查找到 函数地址[${fnAdr}] 的moduleName为null`)
  }

  if(this.moduleName==moduleName){
    throw new Error(`[入参错误][疑似上层算法错误]   函数地址[${fnAdr}] 的moduleName[${moduleName}] 不等于 本MG_Module的moduleName[${this.moduleName}]`)
  }

  //讨厌名为空的函数
  if (fnName==null || fnName==undefined){
    logWriteLn(`##讨厌名为空的函数.fnAdr=[${fnAdr}]`)
    return _NOT_FOCUS;
  }

  //默认动作 若为包含, 则关注
  if(this.defaultAct==MG_Enum_DefaultAct.Include){
    //关注 包含函数名们
    const __focus:boolean=this.fnNameLs_include.includes(fnName);
    return __focus;

  } 
  //默认动作 若为排除, 则讨厌
  else if(this.defaultAct==MG_Enum_DefaultAct.Exclude){

    //讨厌 排除函数名们
    const __focus:boolean=(!this.fnNameLs_exclude.includes(fnName));
    return __focus;

  }else{
    //断言是合法枚举
    assertIsValidEnum_DefaultAct(this.defaultAct);
  }

  throw new Error(`[不应该能走到MG_Module.focus函数的最末尾][自身逻辑错误]   函数地址[${fnAdr}] ,json(fnSym)[${JSON.stringify(fnSym)}] , json(this)[${JSON.stringify(this)}]`)

}

};


