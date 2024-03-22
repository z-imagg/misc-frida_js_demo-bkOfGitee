#!/usr/bin/env python

#【文件作用】  对 frida-trace 工具 生成的 .js 文件 的 onEnter行、onLeave行 插入 相关调用语句

#【用法】 me.py /fridaAnlzAp/frida_js/__handlers__/simple_nn.elf/_ZNKSt12__shared_ptrIN5torch2nn1_b6234db8.js

from pathlib import Path
import typing

onEnter_Ln:str="  onEnter(log, args, state) {\n"
onEnter_Insert:str="fridaTraceJsOnEnterBusz(this, log, args, state)\n"

onLeave_Ln:str="  onLeave(log, retval, state) {\n"
onLeave_Insert:str="fridaTraceJsOnLeaveBusz(this, log, retval, state)\n"

def insertCall(jsFpGenByFridaTrace:str):
    jsFp:Path=Path(jsFpGenByFridaTrace)

    jsTxt:str=jsFp.read_text()

    jsTxt.replace(onEnter_Ln,f"{onEnter_Ln}{onEnter_Insert}")
    jsTxt.replace(onLeave_Ln,f"{onLeave_Ln}{onLeave_Insert}")
    
    lnLs0:typing.List[str]=jsTxt.splitlines()
    
    # 删除 onEnter 中原来的 行 log('...')
    lnLs1=list(filter(
        lambda ln: not ln.startswith("log('"),
        lnLs0
    ))

    jsTxtNew:str="\n".join(lnLs1)
    
    jsFp.write_text(jsTxtNew)
    return


if __name__=="__main__":
    import sys
    assert len(sys.argv) == 2
    jsFpGenByFridaTrace:str=sys.argv[1]
    insertCall(jsFpGenByFridaTrace)