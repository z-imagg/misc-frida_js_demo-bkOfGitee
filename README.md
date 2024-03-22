来源： https://github.com/oleavr/frida-agent-example.git



frida命令bash补全脚本生成
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

Stalker.follow  【simple_nn.elf,  libtorch.so.1 , libc10.so , libcaffe2.so 】未获得任何call event，

而 Stalker.follow 【 frida-agent-64.so 】有获得call event 如下
```txt
 [0x2cf59e]( [0x2cf59e] ) -- 0
 [0x2b5b5d]( [0x2b5b5d] ) -- 0
 [0x22eaa8]( [0x22eaa8] ) -- -1
 [0x22eab0]( [0x22eab0] ) -- -1
 [0x22ead0]( [0x22ead0] ) -- 0
  [0x22eaec]( [0x22eaec] ) -- 1
   [0x22eafc]( [0x22eafc] ) -- 2
    [0x22eb0b]( [0x22eb0b] ) -- 3
     [0x22eb13]( [0x22eb13] ) -- 4
     [0x22ec7c]( [0x22ec7c] ) -- 4
      [0x22ec84]( [0x22ec84] ) -- 5
      [0x22ee78]( [0x22ee78] ) -- 5
       [0x22ee78]( [0x22ee78] ) -- 6
        [0x22ee78]( [0x22ee78] ) -- 7
         [0x22ee78]( [0x22ee78] ) -- 8
          [0x22ee78]( [0x22ee78] ) -- 9
           [0x22ee78]( [0x22ee78] ) -- 10

```

```js
// /fridaAnlzAp/frida_js/node_modules/@types/frida-gum/index.d.ts

type StalkerCallEventFull = ["call", NativePointer | string, NativePointer | string, number];  //长度为 4
type StalkerCallEventBare = [NativePointer | string, NativePointer | string, number];          //长度为 3
```

```evt.length=4``` 表明 evt的类型是 ```StalkerCallEventFull```
```evt.length=3``` 表明 evt的类型是 ```StalkerCallEventBare```