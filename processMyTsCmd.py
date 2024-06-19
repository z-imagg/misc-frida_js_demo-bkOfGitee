

import typing
#待执行指令
MyTsCmd_Prefix:str='//MyTsCmd//'
#执行结果展示指令.  
MyTsCmdResult_Prefix:str='//MyTsCRst//'
# Rst==Result

LF:str="\n"
CRLF:str=f"\r{LF}"

Idx_CurLn:int=0
Idx_NextLn:int=1

###################用户接口 开始
def _fileName(fpath:str)->str:
    from pathlib import Path
    fname:str=Path(fpath).name
    return fname

def _jsonLoad(configJsonF_fpath:str, name_path:str)->typing.List[str]:
    from jsonpath_ng import parse,jsonpath,Child,DatumInContext
    configJsonTxt:str=readTxtFile(configJsonF_fpath)
    import json
    configJsonObj:typing.Dict[str,typing.Any]=json.loads(configJsonTxt)
    jsonpath_expr:Child=parse(name_path)
    dLs:typing.List[DatumInContext]=jsonpath_expr.find(configJsonObj)
    valLs:typing.List[str]=[d.value for d in dLs]
    return valLs

def _jsonLoad0(configJsonF_fpath:str, name_path:str)->str:
    valLs:typing.List[str]=_jsonLoad(configJsonF_fpath, name_path)
    if valLs is None or valLs.__len__() == 0:
        return None
    assert valLs.__len__() == 1
    val0:str=valLs[0]
    return val0

def _replaceSubStrInNextLine(srcTxt:str, targetTxt:str, curNextLn:typing.Tuple[str,str])->bool:
    assert curNextLn is not None and curNextLn.__len__() == 2
    curLn,nextLn=curNextLn
    nextLn_new:str=nextLn.replace(srcTxt,targetTxt)
    #下一行内容
    curNextLn[Idx_NextLn]=nextLn_new
    #当前行换成执行结果指令
    title:str=MyTsCmdReplacePrefix(curLn)
    curNextLn[Idx_CurLn]=f"{title}"
    return

def _replaceCurLineByTsFileContent(tsF:str, curNextLn:typing.Tuple[str,str])->bool:
    assert curNextLn is not None and curNextLn.__len__() == 2
    curLn,nextLn=curNextLn
    tsF_txt:str=readTxtFile(tsF)
    title:str=MyTsCmdReplacePrefix(curLn)
    #当前行前追前执行结果指令行
    curNextLn[Idx_CurLn]=f"{title}{LF}{tsF_txt}"
    return
###################用户接口 结束

###################主逻辑(解析、执行) 开始
def MyTsCmdReplacePrefix(MyTsCmd:str)->str:
    assert isMyTsCmd(MyTsCmd)
    myTsCmdResult:str=MyTsCmd.replace(MyTsCmd_Prefix,MyTsCmdResult_Prefix)
    return myTsCmdResult

def isMyTsCmd(txt:str):
    if txt is None:
        return False
    if txt.count(LF) > 0:
        return False
    if txt.count(CRLF) > 0:
        return False
    _isMyTsCmd:bool=  txt.startswith(MyTsCmd_Prefix)
    return _isMyTsCmd

#执行MyTsCmd
def execMyTsCmd(curNextLn)->str:
    curLn,nextLn=curNextLn
    assert isMyTsCmd(curLn)
    MyTsCmd:str=curLn
    py_stmt=MyTsCmd.replace(MyTsCmd_Prefix,"")
    _locals_ret={"curNextLn":curNextLn}
    _globals=None
    ret=eval(py_stmt,_globals, _locals_ret)
    #获取返回值
    curLn_new,nextLn_new=_locals_ret["curNextLn"]
    curNextLn[Idx_CurLn]=curLn_new
    curNextLn[Idx_NextLn]=nextLn_new
    return ret

#读取该ts文件的文本内容
def readTxtFile(fpath:str)->str:
    from  pathlib import Path
    txt:str=Path(fpath).read_text()
    return txt

#写入该ts文件的文本内容
def writeTxtFile(fpath:str,txt:str)->int:
    from  pathlib import Path
    ret:int=Path(fpath).write_text(txt)
    return ret

#单行文本转换
def lineK_transform(line_ls_new,lineCnt,k,curNextLn:typing.Tuple[str,str])->bool:
    curLn,nextLn=curNextLn
    #若是MyTsCmd，则执行，并返回执行结果
    if isMyTsCmd(curLn):
        execMyTsCmd(curNextLn)
        #获取更改后的值
        curLn_new,nextLn_new=curNextLn
        if k < lineCnt : line_ls_new[k] = curLn_new
        nextLnIdex:int=k+1
        if nextLnIdex < lineCnt : line_ls_new[nextLnIdex] = nextLn_new
        return True
    #否则,保持该行不变
    else:
        return False

#处理主ts文件    
def process(fpath_mainTs:str)->None:
    #读取主ts文件
    mainTs_txt:str=readTxtFile(fpath_mainTs)
    #主ts文本按行拆开
    line_ls:typing.List[str]=mainTs_txt.split(LF)
    line_ls_new:typing.List[str]=[*line_ls]
    lineCnt:int=line_ls.__len__()
    line_ls_next:typing.List[str]=[*(line_ls[1:]),None]
    curNextTupleLs:typing.List[typing.Tuple[str,str]]=[ [line_ls[k],line_ls_next[k]] for k in range(lineCnt)]
    #转换各行
    [lineK_transform(line_ls_new,lineCnt,k,curNextLn) for k,curNextLn in  enumerate(curNextTupleLs)]
    #新行们粘结成大文本
    mainTs_txt_2:str=LF.join(line_ls_new)
    #写入转换后ts文本
    fpath_mainTs_new:str=_pathAddSuffix(fpath_mainTs,"_generated")
    print(f"fpath_mainTs_new={fpath_mainTs_new}")
    writeTxtFile(fpath_mainTs_new,mainTs_txt_2)
    return

#对 文件路径 中名称 加后缀, 其余不变
def _pathAddSuffix(fpath:str,suffix:str)->str:
    from pathlib import Path
    fp:Path=Path(fpath)
    fp_noExtend:str=fp.stem
    fp_new:Path=fp.with_stem(f"{fp_noExtend}{suffix}")
    fpath_new:str=fp_new.as_posix()
    return fpath_new
###################主逻辑(解析、执行) 结束

###################单元测试 开始
def __test_jsonLoad():
    appPath:str=_jsonLoad0("./config.json","$.appPath")
    appName:str=_fileName(appPath)
    print(f"appPath={appPath},appName={appName}")
    return appPath,appName

def _test__execMyTsCmd():
    execMyTsCmd('//MyTsCmd//_tsF_to_import="./_focus_fnAdr.ts"')
    pass

def _test__process():
    process("InterceptFnSym.ts")
    pass
###################单元测试 结束

###################主入口 开始
def _main():
    import sys
    assert(sys.argv.__len__()>1)
    ts_fpath:str=sys.argv[1]
    process(ts_fpath) # ts_fpath 比如 "InterceptFnSym.ts"

if __name__=="__main__":
    _main()
    # val=__test_jsonLoad()
    # _test__process()
    end=True
###################主入口 结束