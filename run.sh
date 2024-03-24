#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

function get_bash_en_dbg() {
  bash_en_dbg=false; [[ $- == *x* ]] && bash_en_dbg=true #记录bash是否启用了调试模式
}

function call_frida_trace() {

#开发调试用的命令，为了快速运行结束
# frida-trace  --output  frida-trace-out-$(date +%s).log --init-session ./DebugSymbolUtil.js  --decorate  --include  "simple_nn.elf!*Linear*"  --include "libtorch.so.1!*tensor*"  --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf

#生产用的命令，更全面，但运行耗时更久
frida-trace  --output  frida-trace-out-${LogTitle}-$(date +%s).log --init-session ./DebugSymbolUtil.js  --decorate   -I "simple_nn.elf"  -I "libtorch.so.1"  -I "libc10.so"  -I "libcaffe2.so"    --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf
}

cd /fridaAnlzAp/frida_js/

#安装frida py工具
# 临时关闭bash调试模式， 是 由于 miniconda 的 activate 脚本内容太大，从而减少视觉干扰
get_bash_en_dbg  #记录bash是否启用了调试模式
$bash_en_dbg && set +x #如果启用了调试模式, 则关闭调试模式
source /app/Miniconda3-py310_22.11.1-1/bin/activate
$bash_en_dbg && set -x #如果启用了调试模式, 则打开调试模式
pip install -r requirements.txt

#编译出  /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf
bash -x  /fridaAnlzAp/torch-cpp/v1.0.0/build.sh

#删除旧日志
rm -frv *.log

chmod +x InsertCall.py

npx frida-compile  DebugSymbolUtil.ts --no-source-maps --output DebugSymbolUtil.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/frida-trace初始化js/d' DebugSymbolUtil.js && \

#0. 删除 ./__handlers__/*.js
rm -fr ./__handlers__ && \

#1. 初次运行frida-trace，用以新生成 ./__handlers__/*.js 
#   frida-trace 先生成 准空白 js , 再 执行 准空白 js
LogTitle="GenEmptyJs" && call_frida_trace

#2. 用InsertCall.py 插入 调用业务函数语句 到 ./__handlers__/*.js
./InsertCall.py /fridaAnlzAp/frida_js/__handlers__/ && \

#3. 再次运行frida-trace，执行 修改后的 ./__handlers__/*.js
#   frida-trace 发现 已有 js , 直接 执行 该 js
LogTitle="RunBuszJs" call_frida_trace

