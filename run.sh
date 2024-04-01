#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

function get_bash_en_dbg() {
  bash_en_dbg=false; [[ $- == *x* ]] && bash_en_dbg=true #记录bash是否启用了调试模式
}

function call_frida() {
_LogFP="frida-trace-out-${LogTitle}-$(date +%s).log"
frida  --load ./InterceptFnSym.js     --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf  --output $_LogFP 
# 报错 _enter_buffered_busy: could not acquire lock for 是因为 frida ... | tee 的tee导致的

#记录产生的日志文件的数字签名,防止后续被认为破坏却不知道
md5sum $_LogFP > $_LogFP.md5sum.txt
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

npx frida-compile  InterceptFnSym.ts --no-source-maps --output InterceptFnSym.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/frida-trace初始化js/d' InterceptFnSym.js && \

#运行frida
LogTitle="RunBuszJs" call_frida

