#!/usr/bin/env bash

#去此脚本所在目录
f=$(readlink -f ${BASH_SOURCE[0]})  ; d=$(dirname $f)
cd $d

#重新编译 ts 为 js 
bash -x /fridaAnlzAp/frida_js/rebuild_ts.sh

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
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip install -r requirements.txt

#删除旧日志
rm -frv *.log

#运行frida
now="$(date +%s)"
FridaOut="frida-out"
_LogFP_Mix="${FridaOut}-Mix-${now}.log"
_LogFP_PrefPure="${FridaOut}-PrefixPure-${now}.log"
_LogFP_Pure="${FridaOut}-Pure-${now}.log"
# 运行frida , 产生日志文件 ， 并 记录日志文件的数字签名
#  注意　   　目标应用和其参数　比如为 "aaa.elf arg1 arg2" frida不允许其中的参数以中划线开头　否则会被当成是frida的参数, 
#     即 frida只允许应用携带非中划线参数
sudo env "PATH=$PATH" frida  --load ./InterceptFnSym.js    --output $_LogFP_Mix    --file /fridaAnlzAp/cgsecurity--testdisk/src/qphotorec
md5sum $_LogFP_Mix > $_LogFP_Mix.md5sum.txt
# 日志后处理
#   提取出带前缀的纯净日志， 并 记录日志文件的数字签名
grep __@__@   $_LogFP_Mix >  $_LogFP_PrefPure
md5sum $_LogFP_PrefPure > $_LogFP_PrefPure.md5sum.txt
#   去掉前缀成为纯净日志， 并 记录日志文件的数字签名
sed 's/^__@__@//' $_LogFP_PrefPure > $_LogFP_Pure
md5sum $_LogFP_Pure > $_LogFP_Pure.md5sum.txt

#最终产物日志文件名举例： frida-out-Pure-1712031317.log  
#    其数字签名举例： frida-out-Pure-1712031317.log.md5sum.txt
