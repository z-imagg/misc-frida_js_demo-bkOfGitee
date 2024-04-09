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
```