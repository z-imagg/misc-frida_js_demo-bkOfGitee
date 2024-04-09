
###  临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同

https://blog.csdn.net/counsellor/article/details/81543197


### frida命令bash补全脚本生成
```shell
source /app/Miniconda3-py310_22.11.1-1/bin/activate
pip install frida==16.0.7 frida-tools==12.0.4
helpTxt2bashComplete.py --progFile frida
source bash-complete--frida.sh
#frida --<tab><tab> 可获得补全
```
