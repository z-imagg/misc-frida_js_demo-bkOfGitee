#!/bin/bash

#【描述】 重新编译 ts 为 js 
#【备注】 并删除frida-compile再js文件开头添加的乱七八糟的几行

#去此脚本所在目录
cd /fridaAnlzAp/frida_js_demo/



function build_proj(){
local outTsFName=InterceptFnSym.ts.transform
local ok_outTsFName=InterceptFnSym.transform.ts
local outJsFName=InterceptFnSym.js.transform

python3 processMyTsCmd.py ./InterceptFnSym.ts
mv $outFName $ok_outTsFName #改名 是因为 frida-compile 会检查文件扩展名
npx frida-compile  $ok_outTsFName --no-source-maps --output $outJsFName  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/MyTsBegin/d' $outJsFName
mv $ok_outTsFName $outTsFName
}


#先构建
build_proj || \
#若构建失败 再 安装依赖 并 构建
( npm install && build_proj )


#理由是 npm install 经常很卡