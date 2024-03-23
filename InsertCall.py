#!/usr/bin/env python

#【文件作用】  对 frida-trace 工具 生成的 .js 文件 的 onEnter行、onLeave行 插入 相关调用语句

#【用法】 me.py /fridaAnlzAp/frida_js/__handlers__/simple_nn.elf/_ZNKSt12__shared_ptrIN5torch2nn1_b6234db8.js

from pathlib import Path
import typing

onEnter_Ln:str="  onEnter(log, args, state) {\n"
onEnter_Insert:str="fridaTraceJsOnEnterBusz(this, log, args, state)\n"

onLeave_Ln:str="  onLeave(log, retval, state) {\n"
onLeave_Insert:str="fridaTraceJsOnLeaveBusz(this, log, retval, state)\n"

LogLn_toDel:str="    log('"

def insertCall(jsFp:Path):
    # jsFp:Path=Path(jsFpGenByFridaTrace)

    jsTxt:str=jsFp.read_text()

    if jsTxt.__contains__(onEnter_Insert) and jsTxt.__contains__(onLeave_Insert):
        print(f"跳过已处理的文件,{jsFpGenByFridaTrace}")
        return

    jsTxt=jsTxt.replace(onEnter_Ln,f"{onEnter_Ln}{onEnter_Insert}")
    jsTxt=jsTxt.replace(onLeave_Ln,f"{onLeave_Ln}{onLeave_Insert}")
    
    lnLs0:typing.List[str]=jsTxt.splitlines()
    
    # 删除 onEnter 中原来的 行 log('...')
    lnLs1=list(filter(
        lambda ln: not ln.startswith(LogLn_toDel),
        lnLs0
    ))

    jsTxtNew:str="\n".join(lnLs1)
    
    jsFp.write_text(jsTxtNew)
    print(f"正常插入语句到js文件,{jsFpGenByFridaTrace}")
    return


def LoopJsFp(jsRootDirStr:str):
    # jsRootDir:Path=Path("/fridaAnlzAp/frida_js/__handlers__/")
    jsRootDir:Path=Path(jsRootDirStr)
    for jsPth in jsRootDir.glob("**/*.js"):
        insertCall(jsPth)

if __name__=="__main__":
    import sys
    assert len(sys.argv) == 2
    jsRootDirStr:str=sys.argv[1] # sys.argv[1] == "/fridaAnlzAp/frida_js/__handlers__/"
    insertCall(jsRootDirStr)