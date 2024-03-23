#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

function call_frida_trace() {
frida-trace  --init-session ./DebugSymbolUtil.js  --decorate  --include  "simple_nn.elf!*Linear*"  --include "libtorch.so.1!*tensor*"  --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf
}

cd /fridaAnlzAp/frida_js/

chmod +x InsertCall.py

npx frida-compile  DebugSymbolUtil.ts --no-source-maps --output DebugSymbolUtil.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/frida-trace初始化js/d' DebugSymbolUtil.js && \

#0. 删除 上次 frida-trace生成的所有 .js 脚本
# 删除 ./__handlers__/*.js
rm -fr ./__handlers__ && \

#1. frida-trace新生成的所有 .js 脚本
# 调用frida-trace 生成 ./__handlers__/*.js
call_frida_trace

#2. 用InsertCall.py对这些 新 .js 脚本  插入 调用业务函数语句
# 插入 调用业务函数语句 到 ./__handlers__/*.js
find ./__handlers__/ -name "*.js" | xargs -I% ./InsertCall.py %

#3. 此时frida-trace发现已经有目录__handlers__, 将使用该目录下被修改后的 .js   , 从而 间接利用frida-trace 调用了 业务函数语句
# 基于 修改后的 再次调用frida-trace
call_frida_trace

# frida-trace  --decorate  -I "simple_nn.elf"  -I "libtorch.so.1"  -I "libc10.so"  -I "libcaffe2.so"   --file ./simple_nn.elf
