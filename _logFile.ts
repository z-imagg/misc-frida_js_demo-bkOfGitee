

const logf:File=new File("./InterceptFnSym.log","w");

function logWriteLn(txt:string):void{
  const lineTxt:string=`${txt}\n`
  logf.write(lineTxt)
}