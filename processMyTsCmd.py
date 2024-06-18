

import typing
MyTsCmd_Prefix:str='//MyTsCmd//'
MyTsCmdResult_Prefix:str='//MyTsCR//'
LF:str="\n"
CRLF:str=f"\r{LF}"

def get__MyTsCmdResult(myTsCmd:str)->str:
    assert isMyTsCmd(myTsCmd)
    myTsCmdResult:str=myTsCmd.replace(MyTsCmd_Prefix,MyTsCmdResult_Prefix)
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

#解析MyTsCmd为文件路径
def parseMyTsCmd(myTsCmd:str)->str:
    assert isMyTsCmd(myTsCmd)
    py_stmt=myTsCmd.replace(MyTsCmd_Prefix,"")
    _locals_ret={}
    _globals=None
    exec(py_stmt,_globals, _locals_ret)
    _tsF_to_import:str=_locals_ret['_tsF_to_import']
    print(f"_tsF_to_import={_tsF_to_import}")
    return _tsF_to_import
    pass

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

#执行MyTsCmd
def execMyTsCmd(myTsCmd:str)->str:
    #解析MyTsCmd为文件路径
    _tsF_to_import:str=parseMyTsCmd(myTsCmd)
    #读取该ts文件的文本内容
    tsTxt:str=readTxtFile(_tsF_to_import)
    title:str=get__MyTsCmdResult(myTsCmd)
    tsTxt_2:str=f"{title}{LF}{tsTxt}"
    return tsTxt_2

#单行文本转换
def lineK_transform(lineK:str):
    #若是MyTsCmd，则执行，并返回执行结果
    if isMyTsCmd(lineK):
        tsTxt:str=execMyTsCmd(lineK)
        return tsTxt
    #否则,保持该行不变
    else:
        return lineK

#处理主ts文件    
def process(fpath_mainTs:str)->None:
    #读取主ts文件
    mainTs_txt:str=readTxtFile(fpath_mainTs)
    #主ts文本按行拆开
    line_ls:typing.List[str]=mainTs_txt.split(LF)
    #转换各行
    line_ls_2:typing.List[str]=list(map(lineK_transform, line_ls))
    #新行们粘结成大文本
    mainTs_txt_2:str=LF.join(line_ls_2)
    #写入转换后ts文本
    fpath_mainTs_new:str=f"{fpath_mainTs}.transform"
    writeTxtFile(fpath_mainTs_new,mainTs_txt_2)
    
    pass

def _test__execMyTsCmd():
    execMyTsCmd('//MyTsCmd//_tsF_to_import="./_focus_fnAdr.ts"')
    pass


def _test__process():
    process("InterceptFnSym.ts")
    pass

if __name__=="__main__":
    process("InterceptFnSym.ts")