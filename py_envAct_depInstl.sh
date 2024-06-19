#!/bin/bash

cd /fridaAnlzAp/frida_js_demo/

### frida命令bash补全脚本生成
set +x ; source /app/Miniconda3-py310_22.11.1-1/bin/activate ; set -x
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple > /dev/null
pip install -r requirements.txt > /dev/null

