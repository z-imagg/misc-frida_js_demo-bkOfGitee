来源： https://github.com/oleavr/frida-agent-example.git


### 其他

 详见：　 http://giteaz:3000/frida_analyze_app_src/frida_js/src/branch/main/msic.md
 
 1. 临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同; 　 
 
 2. frida命令bash补全脚本生成



### 使用举例2

cgsecurity--testdisk   来自， https://gitee.com/disk_recovery/cgsecurity--testdisk.git


#### 安装依赖

```npm install```


#### 编译目标应用

有cmd-wrap时testdisk编译步骤 ，```-O2 -g``` --> ```-O1 -g1``` [cmd-wrap.git/v2.2.simpl/build_testdisk.md](http://giteaz:3000/bal/cmd-wrap/src/tag/v2.2.simpl/build_testdisk.md)  , [cmd-wrap.git/7fc35/build_testdisk.md](http://giteaz:3000/bal/cmd-wrap/src/commit/7fc355dd259b847f14b9b8db61d649d3ff3df3b6/build_testdisk.md)

```shell
ldd /fridaAnlzAp/cgsecurity--testdisk/src/testdisk
	# linux-vdso.so.1 (0x00007ffff7fc1000)
	# libncursesw.so.6 => /lib/x86_64-linux-gnu/libncursesw.so.6 (0x00007ffff7f00000)
	# libtinfo.so.6 => /lib/x86_64-linux-gnu/libtinfo.so.6 (0x00007ffff7ece000)
	# libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ffff7c00000)
	# /lib64/ld-linux-x86-64.so.2 (0x00007ffff7fc3000)
```

#### 用frida_js运行编译出 应用程序 simple_nn.elf

```shell

#编译出  /fridaAnlzAp/cgsecurity--testdisk/src/testdisk

bash /fridaAnlzAp/frida_js/fridaJs_runApp.sh 
# 或  frida  --load ./InterceptFnSym.js  --stdio inherit  --output 1.log    --file /fridaAnlzAp/cgsecurity--testdisk/src/testdisk /fridaAnlzAp/cgsecurity--testdisk/hd.img
```

得到输出如下，　testdisk进程没有正常显示ncurses界面　且　　testdisk进程 在　输出 ```TestDisk 7.2, Data Recovery Utility, February 2024 ... ``` 后　直接退出了

一种解释： frida_js的console.log输出干扰了testdisk的ncurses界面按键输入, 

感觉可能唯一解决办法是用py驱动frida（有点麻烦）

```txt
...

##1712673671139,04/09/2024, 10:41:11 PM;Interceptor.attach fnAdr=0x55555559a0bc;  进度【3964~3965 】
Spawned `/fridaAnlzAp/cgsecurity--testdisk/src/testdisk /fridaAnlzAp/cgsecurity--testdisk/hd.img`. Resuming main thread!

TestDisk 7.2, Data Recovery Utility, February 2024
Christophe GRENIER <grenier@cgsecurity.org>
https://www.cgsecurity.org

##只有首次新建对象tmPnt，{"processId":12493,"thrdId":12493,"curTmPnt":0}
[Local::testdisk ]-> ##只有首次查调试信息文件，{"address":"0x55555555c0c0","name":"_start","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}

__@__@{"tmPnt":1,"logId":1,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555c0c0","fnCallId":1,"fnSym":{"address":"0x55555555c0c0","name":"_start","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}
##只有首次查调试信息文件，{"address":"0x55555555a000","name":"_init","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}

__@__@{"tmPnt":2,"logId":2,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555a000","fnCallId":2,"fnSym":{"address":"0x55555555a000","name":"_init","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}

__@__@{"tmPnt":3,"logId":3,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555a000","fnCallId":2,"fnSym":{"address":"0x55555555a000","name":"_init","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}
##只有首次查调试信息文件，{"address":"0x55555555c1a0","name":"frame_dummy","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}

__@__@{"tmPnt":4,"logId":4,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555c1a0","fnCallId":3,"fnSym":{"address":"0x55555555c1a0","name":"frame_dummy","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}
##只有首次查调试信息文件，{"address":"0x55555555c120","name":"register_tm_clones","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}

__@__@{"tmPnt":5,"logId":5,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555c120","fnCallId":4,"fnSym":{"address":"0x55555555c120","name":"register_tm_clones","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}

__@__@{"tmPnt":6,"logId":6,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555c120","fnCallId":4,"fnSym":{"address":"0x55555555c120","name":"register_tm_clones","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}

__@__@{"tmPnt":7,"logId":7,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555c1a0","fnCallId":3,"fnSym":{"address":"0x55555555c1a0","name":"frame_dummy","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}
##只有首次查调试信息文件，{"address":"0x55555555afb0","name":"main","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}

__@__@{"tmPnt":8,"logId":8,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555afb0","fnCallId":5,"fnSym":{"address":"0x55555555afb0","name":"main","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}
##只有首次查调试信息文件，{"address":"0x55555555f730","name":"file_test_availability","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":1720,"column":1}

__@__@{"tmPnt":9,"logId":9,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555f730","fnCallId":6,"fnSym":{"address":"0x55555555f730","name":"file_test_availability","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":1720,"column":1}}
##只有首次查调试信息文件，{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}

__@__@{"tmPnt":10,"logId":10,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555c1c0","fnCallId":7,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}

__@__@{"tmPnt":11,"logId":11,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555c1c0","fnCallId":7,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}

__@__@{"tmPnt":12,"logId":12,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555c1c0","fnCallId":8,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}

__@__@{"tmPnt":13,"logId":13,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555c1c0","fnCallId":8,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}

__@__@{"tmPnt":14,"logId":14,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555c1c0","fnCallId":9,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}

__@__@{"tmPnt":15,"logId":15,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555c1c0","fnCallId":9,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}
##只有首次查调试信息文件，{"address":"0x55555555e170","name":"autoset_geometry","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":1657,"column":1}

__@__@{"tmPnt":16,"logId":16,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555e170","fnCallId":10,"fnSym":{"address":"0x55555555e170","name":"autoset_geometry","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":1657,"column":1}}
##只有首次查调试信息文件，{"address":"0x555555568e10","name":"get_geometry_from_nonembr","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}

__@__@{"tmPnt":17,"logId":17,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x555555568e10","fnCallId":11,"fnSym":{"address":"0x555555568e10","name":"get_geometry_from_nonembr","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}

__@__@{"tmPnt":18,"logId":18,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x555555568e10","fnCallId":11,"fnSym":{"address":"0x555555568e10","name":"get_geometry_from_nonembr","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}

__@__@{"tmPnt":19,"logId":19,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555e170","fnCallId":10,"fnSym":{"address":"0x55555555e170","name":"autoset_geometry","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":1657,"column":1}}
##只有首次查调试信息文件，{"address":"0x55555555f610","name":"update_disk_car_fields","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":950,"column":1}

__@__@{"tmPnt":20,"logId":20,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555f610","fnCallId":12,"fnSym":{"address":"0x55555555f610","name":"update_disk_car_fields","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":950,"column":1}}
##只有首次查调试信息文件，{"address":"0x55555555cb20","name":"log_redirect","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/log.c","lineNumber":211,"column":1}

__@__@{"tmPnt":21,"logId":21,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555cb20","fnCallId":13,"fnSym":{"address":"0x55555555cb20","name":"log_redirect","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/log.c","lineNumber":211,"column":1}}

__@__@{"tmPnt":22,"logId":22,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555cb20","fnCallId":13,"fnSym":{"address":"0x55555555cb20","name":"log_redirect","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/log.c","lineNumber":211,"column":1}}

__@__@{"tmPnt":23,"logId":23,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555f610","fnCallId":12,"fnSym":{"address":"0x55555555f610","name":"update_disk_car_fields","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":950,"column":1}}

__@__@{"tmPnt":24,"logId":24,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555f730","fnCallId":6,"fnSym":{"address":"0x55555555f730","name":"file_test_availability","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/hdaccess.c","lineNumber":1720,"column":1}}
##只有首次查调试信息文件，{"address":"0x55555555d8e0","name":"insert_new_disk","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/fnctdsk.c","lineNumber":199,"column":1}

__@__@{"tmPnt":25,"logId":25,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555d8e0","fnCallId":14,"fnSym":{"address":"0x55555555d8e0","name":"insert_new_disk","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/fnctdsk.c","lineNumber":199,"column":1}}
##只有首次查调试信息文件，{"address":"0x55555555d660","name":"insert_new_disk_aux.part.0","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}

__@__@{"tmPnt":26,"logId":26,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555d660","fnCallId":15,"fnSym":{"address":"0x55555555d660","name":"insert_new_disk_aux.part.0","moduleName":"testdisk","fileName":"","lineNumber":0,"column":0}}

__@__@{"tmPnt":27,"logId":27,"processId":12493,"curThreadId":12493,"direct":1,"fnAdr":"0x55555555c1c0","fnCallId":16,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}

__@__@{"tmPnt":28,"logId":28,"processId":12493,"curThreadId":12493,"direct":2,"fnAdr":"0x55555555c1c0","fnCallId":16,"fnSym":{"address":"0x55555555c1c0","name":"MALLOC","moduleName":"testdisk","fileName":"/fridaAnlzAp/cgsecurity--testdisk/src/common.c","lineNumber":68,"column":1}}

Process terminated

[Local::testdisk ]->

Thank you for using Frida!
(base) z@shl:/fridaAnlzAp/frida_js$ 

```

