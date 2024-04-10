#!/usr/bin/env bash

#【描述】 重新编译 ts 为 js 
#【备注】 并删除frida-compile再js文件开头添加的乱七八糟的几行

#去此脚本所在目录
f=$(readlink -f ${BASH_SOURCE[0]})  ; d=$(dirname $f)
cd $d


npx frida-compile  InterceptFnSym.ts --no-source-maps --output InterceptFnSym.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/frida-trace初始化js/d' InterceptFnSym.js

