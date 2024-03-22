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


```shell

#安装依赖
npm install

#用frida-compile将ts编译为js
npx frida-compile frida-trace.ts --output frida-trace.js
#npm run build #也可以用调用写在package.json中的build代词 

#frida载入此脚本frida-trace.js例子命令
frida --load  /fridaAnlzAp/frida_js/frida-trace.js   --file  /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf  #若要进frida的js命令行，再加选项  --debug --pause

```

###  frida 运行报超时错误 解决

frida 运行报超时错误 ```Failed to load script: timeout was reached``` 解决

####  ~~错误的解决办法： 命令行加选项timeout ~~

~~```frida --timeout 0或-1或很大的数 --file ... ```~~

#### 正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码


参考  https://github.com/frida/frida/issues/113#issuecomment-187134331

```js
setTimeout(function () {
    //业务代码
    deveFunc()

  }, 0);
```
