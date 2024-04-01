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
frida   --load ./InterceptFnSym.js      --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf | tee $_LogFP 
# 报错 _enter_buffered_busy: could not acquire lock for 是因为 frida ... | tee 的tee导致的
##Interceptor.attach fnAdr=0x7ffff202a550;  __gconv_open, 0x7ffff202a550, libc.so.6, , 0 
# Spawned `/fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf`. Resuming main thread!
# [Local::simple_nn.elf ]-> ##只有首次新建对象tmPnt，{"processId":16287,"thrdId":16287,"curTmPnt":0}
# ##只有首次查调试信息文件，{"address":"0x7ffff2029dc0","name":"__libc_start_main","moduleName":"libc.so.6","fileName":"","lineNumber":0,"column":0}

# __@__@{"tmPnt":1,"logId":1,"processId":16287,"curThreadId":16287,"direct":1,"fnAdr":"0x7ffff2029dc0","fnCallId":1,"fnSym":{"address":"0x7ffff2029dc0","name":"__libc_start_main","moduleName":"libc.so.6","fileName":"","lineNumber":0,"column":0}}
# Output Tensor: -0.1279 -0.0719 -0.0550 -0.1142 -0.2008  0.0285  0.0367 -0.3699  0.0673  0.3788
# -0.2169 -0.1224  0.2177  0.0046 -0.6586  0.0210  0.1876  0.0927 -0.2545  0.1918
# -0.5200 -0.1086  0.0738 -0.2658  0.2887 -0.2800  0.3595 -0.2577 -0.2300  0.1741
# -0.2216 -0.0055  0.1460  0.1043 -0.0791 -0.0650  0.2210 -0.2053  0.0973  0.2799
# -0.4256 -0.6426  0.2276  0.0998 -0.0099  0.0124  0.1519 -0.1078 -0.3038  0.3016
# [ Variable[CPUFloatType]{5,10} ]
# Process terminated

# Thank you for using Frida!
# Fatal Python error: _enter_buffered_busy: could not acquire lock for <_io.BufferedReader name='<stdin>'> at interpreter shutdown, possibly due to daemon threads
# Python runtime state: finalizing (tstate=0x00000000007797f0)

# Current thread 0x00007ffff7eae440 (most recent call first):
#   <no Python frame>

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

