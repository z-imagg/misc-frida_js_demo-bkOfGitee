#!/usr/bin/env bash


npx frida-compile frida-trace.ts --output frida-trace.js  && \
frida --load  /fridaAnlzAp/frida_js/frida-trace.js   --file  /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf  --output output.log # --pause
#调试信心中函数个数=289146