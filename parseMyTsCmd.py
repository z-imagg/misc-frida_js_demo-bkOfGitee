

import typing
MyTsCmd_Prefix:str='//MyTsCmd//'

def isMyTsCmd(txt:str):
    if txt is None:
        return False
    if txt.count("\n") > 0:
        return False
    if txt.count("\r\n") > 0:
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

def execMyTsCmd(myTsCmd:str)->str:
    #解析MyTsCmd为文件路径
    _tsF_to_import:str=parseMyTsCmd(myTsCmd)
    #读取该ts文件的文本内容
    tsTxt:str=readTxtFile(_tsF_to_import)
    return tsTxt

def lineK_transform(lineK:str):
    if isMyTsCmd(lineK):
        tsTxt:str=execMyTsCmd(lineK)
        return tsTxt
    else:
        return lineK
    
def process(fpath_mainTs:str)->None:
    mainTs_txt:str=readTxtFile(fpath_mainTs)
    line_ls:typing.List[str]=mainTs_txt.split("\n")
    line_ls_2:typing.List[str]=list(map(lineK_transform, line_ls))
    mainTs_txt_2:str="\n".join(line_ls_2)
    writeTxtFile(fpath_mainTs,mainTs_txt_2)
    
    pass

def _test__execMyTsCmd():
    execMyTsCmd('//MyTsCmd//_tsF_to_import="./_focus_fnAdr.ts"')
    pass


def _test__process():
    process("InterceptFnSym.ts")
    pass

if __name__=="__main__":
    # _test__execMyTsCmd()
    _test__process()