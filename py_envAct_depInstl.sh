#!/bin/bash

#[描述] 激活py环境 、 py依赖安装

cd /fridaAnlzAp/frida_js_demo/

_CondaHome=/app/Miniconda3-py310_22.11.1-1
_CondaBin=$_CondaHome/bin
_CondaActv=$_CondaBin/activate
_CondaPip=$_CondaBin/pip
_CondaPy=$_CondaBin/python
_CondaFrida=$_CondaBin/frida
_CondaFridaCompile=$_CondaBin/frida-compile

# 激活py环境(不再需要)
# source $_CondaActv ; 

#升级pip
$_CondaPy -m pip install --upgrade pip 
#pip清华镜像
$_CondaPip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple > /dev/null
# py依赖安装
$_CondaPip   install -r requirements.txt 

