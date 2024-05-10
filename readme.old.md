来源： https://github.com/oleavr/frida-agent-example.git


### 其他

 详见：　 http://giteaz:3000/frida_analyze_app_src/frida_js/src/branch/main/msic.md
 
 1. 临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同; 　 
 
 2. frida命令bash补全脚本生成



### 使用举例2

cgsecurity--testdisk   来自， https://gitee.com/disk_recovery/cgsecurity--testdisk.git


#### 安装依赖

```npm install```


#### 编译目标应用qphotorec

原始编译步骤、带cmd-wrap的编译带qt的testdisk步骤 ，  [testdisk_build_with_qt.md](https://gitee.com/disk_recovery/cgsecurity--testdisk/blob/c27a3ae0a9aed9b2a31f2eab9ca4b49ab80ab767/testdisk_build_with_qt.md)

```shell
ldd /fridaAnlzAp/cgsecurity--testdisk/src/qphotorec
	# linux-vdso.so.1 (0x00007ffde1da5000)
	# libQt5Gui.so.5 => /lib/x86_64-linux-gnu/libQt5Gui.so.5 (0x0000793ef4200000)
	# libQt5Core.so.5 => /lib/x86_64-linux-gnu/libQt5Core.so.5 (0x0000793ef3c00000)
	# libQt5Widgets.so.5 => /lib/x86_64-linux-gnu/libQt5Widgets.so.5 (0x0000793ef3400000)
	# libstdc++.so.6 => /lib/x86_64-linux-gnu/libstdc++.so.6 (0x0000793ef3000000)
	# libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x0000793ef49e3000)
	# libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x0000793ef2c00000)
	# libGL.so.1 => /lib/x86_64-linux-gnu/libGL.so.1 (0x0000793ef495a000)
	# libpng16.so.16 => /lib/x86_64-linux-gnu/libpng16.so.16 (0x0000793ef491f000)
	# libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x0000793ef4903000)
	# libharfbuzz.so.0 => /lib/x86_64-linux-gnu/libharfbuzz.so.0 (0x0000793ef3b31000)
	# libmd4c.so.0 => /lib/x86_64-linux-gnu/libmd4c.so.0 (0x0000793ef48f1000)
	# libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x0000793ef3319000)
	# libdouble-conversion.so.3 => /lib/x86_64-linux-gnu/libdouble-conversion.so.3 (0x0000793ef41eb000)
	# libicui18n.so.70 => /lib/x86_64-linux-gnu/libicui18n.so.70 (0x0000793ef2800000)
	# libicuuc.so.70 => /lib/x86_64-linux-gnu/libicuuc.so.70 (0x0000793ef2605000)
	# libpcre2-16.so.0 => /lib/x86_64-linux-gnu/libpcre2-16.so.0 (0x0000793ef4161000)
	# libzstd.so.1 => /lib/x86_64-linux-gnu/libzstd.so.1 (0x0000793ef324a000)
	# libglib-2.0.so.0 => /lib/x86_64-linux-gnu/libglib-2.0.so.0 (0x0000793ef2ec6000)
	# /lib64/ld-linux-x86-64.so.2 (0x0000793ef4ade000)
	# libGLdispatch.so.0 => /lib/x86_64-linux-gnu/libGLdispatch.so.0 (0x0000793ef2b48000)
	# libGLX.so.0 => /lib/x86_64-linux-gnu/libGLX.so.0 (0x0000793ef3afd000)
	# libfreetype.so.6 => /lib/x86_64-linux-gnu/libfreetype.so.6 (0x0000793ef253d000)
	# libgraphite2.so.3 => /lib/x86_64-linux-gnu/libgraphite2.so.3 (0x0000793ef3ad6000)
	# libicudata.so.70 => /lib/x86_64-linux-gnu/libicudata.so.70 (0x0000793ef0800000)
	# libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x0000793ef2e50000)
	# libX11.so.6 => /lib/x86_64-linux-gnu/libX11.so.6 (0x0000793ef06c0000)
	# libbrotlidec.so.1 => /lib/x86_64-linux-gnu/libbrotlidec.so.1 (0x0000793ef3ac8000)
	# libxcb.so.1 => /lib/x86_64-linux-gnu/libxcb.so.1 (0x0000793ef2513000)
	# libbrotlicommon.so.1 => /lib/x86_64-linux-gnu/libbrotlicommon.so.1 (0x0000793ef2e2d000)
	# libXau.so.6 => /lib/x86_64-linux-gnu/libXau.so.6 (0x0000793ef48e3000)
	# libXdmcp.so.6 => /lib/x86_64-linux-gnu/libXdmcp.so.6 (0x0000793ef3242000)
	# libbsd.so.0 => /lib/x86_64-linux-gnu/libbsd.so.0 (0x0000793ef2b30000)
	# libmd.so.0 => /lib/x86_64-linux-gnu/libmd.so.0 (0x0000793ef3235000)

```

#### 用frida_js运行编译出 目标应用程序 qphotorec

```shell

#编译出  /fridaAnlzAp/cgsecurity--testdisk/src/qphotorec

bash /fridaAnlzAp/frida_js/fridaJs_runApp.sh 
```