#!/bin/bash

#[描述] 激活py环境 、 py依赖安装

cd /fridaAnlzAp/frida_js_demo/

# 激活py环境
set +x ; source /app/Miniconda3-py310_22.11.1-1/bin/activate ; set -x
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple > /dev/null
# py依赖安装
pip install -r requirements.txt > /dev/null

