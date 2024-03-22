来源： https://github.com/oleavr/frida-agent-example.git


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


### 使用举例

simple_nn.elf   来自， https://gitee.com/frida_analyze_app_src/torch-cpp/blob/master/v1.0.0/readme.md


安装依赖, ```npm install```


```shell

#0. 删除 上次 frida-trace生成的所有 .js 脚本
rm -fr __handlers__/                    && \
#1. frida-trace新生成的所有 .js 脚本
#2. 用InsertCall.py对这些 新 .js 脚本  插入 调用业务函数语句
bash -x run.sh

#3. 此时frida-trace发现已经有目录__handlers__, 将使用该目录下被修改后的 .js   , 从而 间接利用frida-trace 调用了 业务函数语句
bash -x run.sh
```