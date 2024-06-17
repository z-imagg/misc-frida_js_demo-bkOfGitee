
###  临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同
# https://blog.csdn.net/counsellor/article/details/81543197
#临时关闭ASLR(地址空间随机化)
echo 0 |sudo tee  /proc/sys/kernel/randomize_va_space

### frida命令bash补全脚本生成
set +x ; source /app/Miniconda3-py310_22.11.1-1/bin/activate ; set -x
pip install frida==16.0.7 frida-tools==12.0.4
helpTxt2bashComplete.py --progFile frida
source bash-complete--frida.sh
echo "#frida --<tab><tab> 可获得补全"

# 编译 app.c
gcc -c -g1 -O0 app.c -o app.obj
gcc app.obj -o app.elf
./app.elf argv1 argv2