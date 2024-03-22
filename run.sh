#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

npx frida-compile  frida-trace.ts --no-source-maps --output frida-trace.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/frida-trace初始化js/d' frida-trace.js && \
frida-trace  --init-session ./frida-trace.js  --decorate  --include  "simple_nn.elf!*Linear*"  --include "libtorch.so.1!*tensor*"  --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf


# frida-trace  --decorate  -I "simple_nn.elf"  -I "libtorch.so.1"  -I "libc10.so"  -I "libcaffe2.so"   --file ./simple_nn.elf
