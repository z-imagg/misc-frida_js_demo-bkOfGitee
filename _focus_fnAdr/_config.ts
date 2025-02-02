// [描述] 模块的函数名过滤器 配置
// [依赖] : g_appName
// [术语] :  参考 _focus_fnAdr/_impl.ts



//关注其所有函数的模块(暂无)
const _modules_include=[
  "other_module_1.so",
];
// "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
// ldd /fridaAnlzAp/frida_js_demo/app.elf  | awk '{print " \""$1"\","}'
//讨厌其所有函数的模块
const _modules_exclude:string[]=[
  //总是要排除frida-agent.so的， 否则frida会自己调用自己 从而陷入 自死循环 中
  "frida-agent-64.so", 
  //排除 linux可执行elf文件的基础依赖
  "linux-vdso.so.1",
  "libc.so.6",
  "ld-linux-x86-64.so.2",
  "libstdc++.so.6", "libstdc++.so.6.0.30",

  //以下这些是谁带来的?  'ldd ...app.elf' 中貌似没有, 难道是 frida带来的
  "libm.so.6",
  "libpthread.so.0",
  "librt.so.1",
  "libdl.so.2",
  "libgcc_s.so.1"
];


// objdump --syms /app2/sleuthkit/tools/autotools/tsk_recover  2>/dev/null | grep " F" | egrep -i "varLs|TL_TmPnt"  | awk '{print " \""$6"\","}'
/*去掉awk输出如下
0000000000122610 l     F .text	0000000000000095              _ZSt10accumulateIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEES2_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_0ET0_T_SC_SB_T1_
00000000001226b0 l     F .text	00000000000000a5              _ZSt8for_eachIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_1ET0_T_SC_SB_
0000000000122760 l     F .text	0000000000000062              _ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_0clERK9__VarDeclS4_
00000000001227d0 l     F .text	0000000000000197              _ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_1clE9__VarDecl
0000000000121e80 g     F .text	00000000000000b0              _Z23_init_varLs_inFn__RtCxxNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEES4_ii
00000000001216f0 g     F .text	000000000000004a              TL_TmPnt__update
000000000011e480 g     F .text	0000000000000079              _init_varLs_inFn__RtC00
0000000000121740 g     F .text	0000000000000018              TL_TmPnt__get
000000000011e580 g     F .text	000000000000016f              destroyVarLs_inFn__RtC00
0000000000121760 g     F .text	0000000000000037              TL_TmPnt__printPtr
0000000000121fd0 g     F .text	0000000000000632              _Z24destroyVarLs_inFn__RtCxxP11__VarDeclLs
*/
const _moduleApp__clangVar_runtime_fnNameLs:string[]=[
  "_ZSt10accumulateIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEES2_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_0ET0_T_SC_SB_T1_",
  "_ZSt8for_eachIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_1ET0_T_SC_SB_",
  "_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_0clERK9__VarDeclS4_",
  "_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_1clE9__VarDecl",
  "_Z23_init_varLs_inFn__RtCxxNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEES4_ii",
  "TL_TmPnt__update",
  "_init_varLs_inFn__RtC00",
  "TL_TmPnt__get",
  "destroyVarLs_inFn__RtC00",
  "TL_TmPnt__printPtr",
  "_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLs",
];


const _moduleApp__exclude_fnNameLs:string[]=[
//跳过被frida调用的本地函数
"fridaHelper__cxxFuncWrap__std_string_new",
"fridaHelper__cxxFuncWrap__std_string_delete",
"_Z41fridaHelper__cxxFuncWrap__std_string_sizePv",
"_Z41fridaHelper__cxxFuncWrap__std_string_cstrPviPc",
];


//本应用自身模块的函数名过滤器 
//    排除clang-var插件的运行时的函数们、排除调用量很大的函数们
const _appFilter:MG_ModuleFilter=MG_ModuleFilter.build_excludeFuncLs(g_appName, [..._moduleApp__clangVar_runtime_fnNameLs, ..._moduleApp__exclude_fnNameLs])
const _moduleFilterLs:MG_ModuleFilter[]=[_appFilter];

// 之后 _wrap.ts 中 组装出 最终使用的过滤器 mg_moduleFilter_ls  如下所示 
/*
const mg_moduleFilter_ls: MG_ModuleFilter[]=[
  ..._moduleFilterLs, //一般模块过滤器们
  ..._modules_exclude, //讨厌其所有函数的模块
  ..._modules_include //关注其所有函数的模块
];
 */
