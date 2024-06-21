// [描述] 模块的函数名过滤器 包装
// [依赖] : g_appName
// [术语] :  参考 _focus_fnAdr/_impl.ts



const mg_moduleFilter_ls: MG_ModuleFilter[]=[
  //一般模块过滤器们
  ..._moduleFilterLs,
  //讨厌其所有函数的模块
  //   linux操作系统基础库、本应用调用的一些不需要关注的库
  ...MG_ModuleFilter.build_excludeAllFunc_moduleLs(_modules_exclude),
  //关注其所有函数的模块
  //   实际没有这样的模块
  ...MG_ModuleFilter.build_includeAllFunc_moduleLs(_modules_include)

];

//构造 以模块名查找过滤器 的 查找表
const mg_moduleFilter_searchByModuleName:Record<string,MG_ModuleFilter>=mg_moduleFilter_ls.reduce(
//reduce的函数1: 迭代函数
(_dict:Record<string,MG_ModuleFilter>, moduleFilterK:MG_ModuleFilter)=>{
  _dict[moduleFilterK.moduleName] = moduleFilterK;
  return _dict;
}, 
{} //reduce的函数2:  初始字典
);

//是否关注该函数
function focus_fnAdr(fnAdr:NativePointer, _g_appName:string){
  const fnSym=DebugSymbol.fromAddress(fnAdr);
  const moduleName = fnSym.moduleName
  if(moduleName==null){
    throw new Error(`[focus_fnAdr:函数地址的模块名为空错误] fnAdr[${fnAdr}] `)
  }

  //查找该模块的函数名过滤器
  const moduleFilter:MG_ModuleFilter=mg_moduleFilter_searchByModuleName[moduleName];

  //执行该过滤器, 获得是否关注本函数
  const _focus:boolean= moduleFilter.focus(fnAdr)
  return _focus;
}
