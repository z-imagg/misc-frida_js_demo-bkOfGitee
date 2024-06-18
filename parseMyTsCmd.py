
MyTsCmd_Prefix:str='//MyTsCmd//'
def parseMyTsCmd(myTsCmd:str)->str:
    assert myTsCmd is not None and myTsCmd.startswith(MyTsCmd_Prefix)
    py_stmt=myTsCmd.replace(MyTsCmd_Prefix,"")
    _locals_ret={}
    _globals=None
    exec(py_stmt,_globals, _locals_ret)
    _tsF_to_import:str=_locals_ret['_tsF_to_import']
    print(f"_tsF_to_import={_tsF_to_import}")
    return _tsF_to_import
    pass

def readTxtFile(fpath:str)->str:
    pass
    from  pathlib import Path
    txt:str=Path(fpath).read_text()
    return txt

def execMyTsCmd(myTsCmd:str)->str:
    _tsF_to_import:str=parseMyTsCmd(myTsCmd)
    tsTxt:str=readTxtFile(_tsF_to_import)
    pass
def _test__execMyTsCmd():
    execMyTsCmd('//MyTsCmd//_tsF_to_import="./_focus_fnAdr.ts"')
    pass


if __name__=="__main__":
    _test__execMyTsCmd()