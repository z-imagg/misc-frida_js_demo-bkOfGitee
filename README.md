来源： https://github.com/oleavr/frida-agent-example.git



### ~~使用 frida 的正确时机~~

使用 frida 的正确时机   大约是 ：  

所谓正确时机  py的frida脚本依然没让Stalker.follow正常 , https://gitcode.net/pubz/frida_develop/-/tree/76e8bad20b6ebcc4c5322b2314644221ce653352  ==  http://giteaz:3000/frida_analyze_app_src/frida_develop/src/commit/76e8bad20b6ebcc4c5322b2314644221ce653352


1. 孵化(以肉鸡ELF孵化spawn出肉鸡进程pid) 对应 ```frida --file zzz.elf ```
2. 附加(附加attach到该肉鸡进程pid) 
3. 加载js脚本(到肉鸡进程pid) 对应 ```frida --load xxx.js```
4. 苏醒(苏醒resume目标进程pid)   对应 若 ```frida --pause``` 则进入终端后 输入 ```%resume``` 即为 苏醒

#### 正确的时机 具体 请参考

思路版 py和js：
  https://gitcode.net/pubz/frida_develop/-/blob/d4f336d1add4541bcee02769a5b4fe78514f6e10/firda_example/attach_operator_new__constructor.py
，  https://gitcode.net/pubz/frida_develop/-/blob/d4f336d1add4541bcee02769a5b4fe78514f6e10/firda_example/script/attach_operator_new.js


估计能正常使用的py , 但js所在子模块找不到了（估计js可以参考上面的js），
https://gitcode.net/pubz/frida_develop/-/blob/21a6e2d3d8c75eccd1eca8b1865713c0631e09be/frida_main/frida_run_app.py

#### 现状错误原因分析

用 命令```frida``` 即 ```/app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida/__init__.py```无法形成正确时机， 所以只能跟踪到frida-agent.so ，  正确的时机需要像上面说的自己编制py脚本

备注：  ```pip install frida==16.0.7 frida-tools==12.0.4```  提供的 命令 ```frida```

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