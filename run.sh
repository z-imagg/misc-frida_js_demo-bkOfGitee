#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

cd /fridaAnlzAp/frida_js/

chmod +x InsertCall.py

npx frida-compile  DebugSymbolUtil.ts --no-source-maps --output DebugSymbolUtil.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/frida-trace初始化js/d' DebugSymbolUtil.js && \
frida-trace  --init-session ./DebugSymbolUtil.js  --decorate  --include  "simple_nn.elf!*Linear*"  --include "libtorch.so.1!*tensor*"  --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf

#对frida-trace生成的 .js 文件 ，插入 调用业务函数语句
find ./__handlers__/ -name "*.js" | xargs -I% ./InsertCall.py %


# frida-trace  --decorate  -I "simple_nn.elf"  -I "libtorch.so.1"  -I "libc10.so"  -I "libcaffe2.so"   --file ./simple_nn.elf
