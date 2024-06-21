#!/bin/bash

#【描述】 重新编译 ts 为 js 
#【备注】 并删除frida-compile再js文件开头添加的乱七八糟的几行

#去此脚本所在目录
cd /fridaAnlzAp/frida_js_demo/

#激活py环境 、 py依赖安装
source py_envAct_depInstl.sh
#输出 变量 _CondaPy 、_CondaFridaCompile

function build_proj(){
local inTsFName=./InterceptFnSym.ts
local outTsFName=InterceptFnSym_generated.ts
local outJsFName=InterceptFnSym_generated.js

#输出文件 $outTsFName
$_CondaPy processMyTsCmd.py $inTsFName && \
npx frida-compile  $outTsFName --no-source-maps --output $outJsFName  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
# 删除文件 InterceptFnSym_generated.js 的第一行到含有的MyTsBegin行
sed -i '1,/MyTsBegin/d' $outJsFName
}


#先构建
build_proj || \
#若构建失败 再 安装依赖 并 构建
( npm install && build_proj )


#理由是 npm install 经常很卡