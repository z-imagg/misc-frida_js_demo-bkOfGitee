#!/bin/bash


###  临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同
# https://blog.csdn.net/counsellor/article/details/81543197

function _ASLR_disable()  {
#临时关闭ASLR(地址空间随机化)
local F=/proc/sys/kernel/randomize_va_space
echo 0 |sudo tee  $F

#显示现在ASLR配置，应该是0
cat  $F
}


#调用 函数 _ASLR_disable 以禁止 ASLR
_ASLR_disable