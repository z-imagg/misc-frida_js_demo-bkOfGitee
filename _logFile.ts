
// [依赖] : _DateTime_util.ts

const g_logFPath:string=`./InterceptFnSym-${g_appName}.log`
const g_logF:File=new File(g_logFPath,"w+");

function logWriteLn(txt:string):void{
  const lineTxt:string=`${txt}\n`
  g_logF.write(lineTxt)
}