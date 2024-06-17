////fridaJs_Begin

const g_appName: string = "app.elf";

function focus_fnAdr(fnAdr:NativePointer){
  //取得该地址的调试信息
  const fnSym=DebugSymbol.fromAddress(fnAdr);
  const moduleName = fnSym.moduleName

  //断言模块名非空
  if(moduleName==null){
    throw new Error(`【断言失败】moduleName为null`)
  }

  //不关注名为空的函数
  if (fnSym.name==null || fnSym.name==undefined){
    console.log(`##不关注名为空的函数.fnAdr=[${fnAdr}]`)
    return false;
  }

  //若为主模块
  if(moduleName==g_appName   ){
    //跳过:
    if  ([ "func02_skip", "xxx"  ].includes(fnSym.name)   )  {
      return false;
    }
  }

  //若为其他模块
  if(moduleName=="other.so"){
    // 'if ... return' 只关注给定条件, 不需要 全局条件 'return ...'   
    //跳过:
    if (fnSym.name == "func_other"){
      return false;
    }
  }

  //其他情况 跳过
  return false;

}


// BaseNativeTypeMap

let nativeFn__func01_return_int:NativeFunction<void,[number,number]>  |null;  
function get_NativeFn__func01_return_int(){
  const func01_return_int:NativePointer = DebugSymbol.fromName("func01_return_int").address;
  return  new NativeFunction(func01_return_int, 'int',['char','double']);
}

type FnAdrHex=string;
//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer):DebugSymbol {
  const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr);
  return fnSym
}


/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz:InvocationContext,  args:InvocationArguments){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const fnAdr:NativePointer=thiz.context.pc;
  const fnSym :DebugSymbol|undefined= findFnDbgSym(fnAdr)
  console.log(`[OnFnEnterBusz],fnSym=[${fnSym}]`)

  thiz.fnAdr_OnFnEnterBusz=fnAdr;



}

/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz:InvocationContext,  retval:any ){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  var fnAdr=thiz.context.pc;
  const fnSym :DebugSymbol|undefined= findFnDbgSym(fnAdr)
  if(fnAdr!=thiz.fnAdr_OnFnEnterBusz){
    console.log(`##错误，进出函数地址不同`)
  }
  console.log(`[OnFnLeaveBusz],fnSym=[${fnSym}]`)

  if(nativeFn__func01_return_int){
    //call(返回值,参数们) 无返回值，传递null
    const ret_int_ptr:NativePointer=Memory.alloc(4);
    nativeFn__func01_return_int.call(ret_int_ptr,32,1.5);
    const ret_int:number=ret_int_ptr.toInt32();
    console.log(`[nativeFn__func01_return_int],ret_int=[${ret_int}]`)
  }
}

function _main_(){
  //获取 clang-var运行时基础 中函数 TL_TmPnt__update(tmPntVal)
  nativeFn__func01_return_int=get_NativeFn__func01_return_int();

  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    if(!focus_fnAdr(fnAdr)){
      continue;
    }


    Interceptor.attach(fnAdr,{
      onEnter:function  (this: InvocationContext, args: InvocationArguments) {
        OnFnEnterBusz(this,args)
      },
      onLeave:function (this: InvocationContext, retval: InvocationReturnValue) {
        OnFnLeaveBusz(this,retval)
      }

    })
  }

}

function mainFunc_addArgTxt(mnArgTxt:string){
  if (mnArgTxt.length==0){
    console.log("##main参数为空")
    return;
  }
  const func01_return_int:NativePointer = DebugSymbol.fromName("func01_return_int").address;
  if (func01_return_int==null || func01_return_int==undefined){
    console.log("##无main函数,无法通过拦截main函数来添加参数,可能不是类c编译器产生的应用")
    return;
  }
  console.log(`##func01_return_int=${func01_return_int}`)
  const mnArgStrLs_raw:string[]=mnArgTxt.split(" ")
  const mnArgStrLs:string[]=mnArgStrLs_raw.filter(elm=>elm!="")
  Interceptor.attach(func01_return_int, {
      onEnter:function  (this: InvocationContext, args: InvocationArguments) {
        console.log(`##进入main函数`)
        // main(int argc, char** argv): args[0] == int argc, args[1] == wchar *argv[]
        const mnArgMemLs:NativePointer[]=mnArgStrLs.map(mnArgStr=>Memory.allocUtf8String(mnArgStr))
        const mnArgVect:NativePointer = Memory.alloc(mnArgMemLs.length * Process.pointerSize)
        //参数列表作为this的字段，防止被垃圾回收
        this.mnArgVect=mnArgVect;

          for (let [k,argK] of  mnArgMemLs.entries()){
            //每个参数都作为this的字段，防止被垃圾回收
            this[`mnArgMem${k}`]=argK

            mnArgVect.add(k*Process.pointerSize).writePointer(argK);
          }

  
          
          // 覆盖 main(int argc, char** argv) 中的argc 、 argv
          args[0] = ptr(mnArgMemLs.length);
          args[1] = mnArgVect;
          
      }
  });
}



/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决
frida 运行报超时错误 "Failed to load script: the connection is closed" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
  //qemu启动启用了PVH的（linux原始内核）vmlinux, 参考:  http://giteaz:3000/frida_analyze_app_src/app_env/src/tag/tag_release__qemu_v8.2.2_build/busz/02_qemu_boot_vmlinux.sh
  const mnArgTxt:string='/app/qemu/build-v8.2.2/qemu-system-x86_64 -nographic  -append "console=ttyS0"  -kernel  /app/linux/vmlinux -initrd /app/linux/initRamFsHome/initramfs-busybox-i686.cpio.tar.gz';
  // -d exec -D qemu.log  
  //业务代码
  mainFunc_addArgTxt(mnArgTxt)
  _main_()

}, 0);
