#!/bin/bash

cd /fridaAnlzAp/frida_js_demo/

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同
bash ASLR_disable.sh

#激活py环境 、 py依赖安装
source py_envAct_depInstl.sh
#输出 变量 _CondaFrida

### frida命令bash补全脚本生成
# helpTxt2bashComplete.py --progFile frida
# source bash-complete--frida.sh
# echo "#frida --<tab><tab> 可获得补全"

# 从配置文件中读取应用名
_appPath=$(jq -r .appPath config.json)
_appName=$(basename $_appPath)
_appArgLsAsTxt=$(jq -r .appArgLsAsTxt config.json)

# 编译 app.cpp
g++ -c -g1 -O0 app.cpp -o app.obj
g++ app.obj -o app.elf
./app.elf $_appArgLsAsTxt || echo "直接运行app.elf报错,退出代码=$?"

#重新编译 ts 为 js 
bash ./rebuild_ts.sh

# 查找编译产物中的函数
#  查找编译产物中 std::string的无参构造函数
objdump  --syms  app.elf |grep 12basic_stringIcSt11char_traitsIcESaIcEE |grep C1Ev
# 0000000000000000       F *UND*	0000000000000000              _ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEC1Ev@GLIBCXX_3.4.21
objdump --syms app.elf | grep  " main"
# 0000000000001217 g     F .text	000000000000009a              main
objdump  --syms  app.elf | grep cxxFunc06_outArgString
# 00000000000011c9 g     F .text	000000000000004e              _Z22cxxFunc06_outArgStringiPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEE

outJsFName=InterceptFnSym_generated.js

# 以frida运行应用
$_CondaFrida  --load $outJsFName        --file $_appPath  $_appArgLsAsTxt  ; exitCode=$? && echo "退出代码=${exitCode}"
# 不知道为什么 frida运行应用的退出代码 exitCode 总是1
# argv[0]=/fridaAnlzAp/frida_js_demo/app.elf
# argv[1]=arg1
# argv[2]=2
# argv[3]=arg3

outTsFName=InterceptFnSym_generated.ts
# rm -v $outTsFName $outJsFName
mv  $outTsFName  ${outTsFName}.txt
mv  $outJsFName  ${outJsFName}.txt

logFPattern="InterceptFnSym-$_appName*"
ls -lht $logFPattern
