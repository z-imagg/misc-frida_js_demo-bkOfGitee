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

# 编译 app.c
gcc -c -g1 -O0 app.c -o app.obj
gcc app.obj -o app.elf
# ./app.elf $_appArgLsAsTxt

#重新编译 ts 为 js 
bash ./rebuild_ts.sh

# 查找编译产物中的函数
objdump --syms app.elf | grep fun
# 0000000000001149 g     F .text  0000000000000055              func01_return_int
objdump --syms app.elf | grep main

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
