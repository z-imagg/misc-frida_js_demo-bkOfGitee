#!/bin/bash

#【描述】 重新编译 ts 为 js 
#【备注】 并删除frida-compile再js文件开头添加的乱七八糟的几行

#去此脚本所在目录
cd /fridaAnlzAp/frida_js_demo/

set +x ; source /app/Miniconda3-py310_22.11.1-1/bin/activate ; set -x
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple > /dev/null
pip install -r requirements.txt > /dev/null

function build_proj(){
local inTsFName=./InterceptFnSym.ts
local outTsFName=InterceptFnSym_generated.ts
local outJsFName=InterceptFnSym_generated.js

#输出文件 $outTsFName
python3 processMyTsCmd.py $inTsFName && \
npx frida-compile  $outTsFName --no-source-maps --output $outJsFName  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/MyTsBegin/d' $outJsFName
}


#先构建
build_proj || \
#若构建失败 再 安装依赖 并 构建
( npm install && build_proj )


#理由是 npm install 经常很卡