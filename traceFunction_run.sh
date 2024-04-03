#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

function get_bash_en_dbg() {
  bash_en_dbg=false; [[ $- == *x* ]] && bash_en_dbg=true #记录bash是否启用了调试模式
}

cd /fridaAnlzAp/frida_js/

#安装frida py工具
# 临时关闭bash调试模式， 是 由于 miniconda 的 activate 脚本内容太大，从而减少视觉干扰
get_bash_en_dbg  #记录bash是否启用了调试模式
$bash_en_dbg && set +x #如果启用了调试模式, 则关闭调试模式
source /app/Miniconda3-py310_22.11.1-1/bin/activate
$bash_en_dbg && set -x #如果启用了调试模式, 则打开调试模式
# pip install -r requirements.txt

#编译出  /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf
# bash -x  /fridaAnlzAp/torch-cpp/v1.0.0/build.sh

npx frida-compile  traceFunction_by_Interceptor_Stalker.ts --no-source-maps --output traceFunction_by_Interceptor_Stalker.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/文件traceFunction_by_Interceptor_Stalker.ts/d' traceFunction_by_Interceptor_Stalker.js && \

#运行frida
now="$(date +%s)"
_LogFP="frida-out-traceFunction_by_Interceptor_Stalker-${now}.log"
# 运行frida , 产生日志文件 ， 并 记录日志文件的数字签名
frida  --load ./traceFunction_by_Interceptor_Stalker.js     --file /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf  --output $_LogFP  
echo "frida退出代码=$?"
md5sum $_LogFP > $_LogFP.md5sum.txt
