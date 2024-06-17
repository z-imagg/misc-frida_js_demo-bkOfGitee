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
    if  ([ "func02_skip", "_init", "_start", "register_tm_clones", "frame_dummy", "__do_global_dtors_aux", "deregister_tm_clones", "_fini"  ].includes(fnSym.name)   )  {
      return false;
    }
    //关注:
    else{
      return true;
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

const C_Lang__sizeof_short=2; // sizeof(short)

//frida中表达 函数 func01_return_int 的签名
// int func01_return_int(char ch, double real_num);
type FnType_func01 = (ch: number, real_num: number) => number;
//持有本地函数
let nativeFn__func01_return_int:FnType_func01  |null;  

class T_User {
  userId: number;
  salary: number;

  constructor(pointer: NativePointer) {
      this.userId = pointer.readShort();
      this.salary = pointer.add(2).readFloat();
  }
}
//frida中表达 函数 func03_return_structUser 的签名
// struct T_User func03_return_structUser(int _userId, char sex)
type FnType_func03 = (_userId: number, sex: number) => T_User; // Uint8Array;
//持有本地函数
let nativeFn__func03_return_structUser:FnType_func03  |null;  

/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz:InvocationContext,  retval:any ){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const fnAdr:NativePointer=thiz.context.pc;
  const fnSym :DebugSymbol|undefined= findFnDbgSym(fnAdr)
  if(fnAdr.readInt()!=thiz.fnAdr_OnFnEnterBusz.readInt()){
    console.log(`##错误，进出函数地址不同`)
  }
  console.log(`[OnFnLeaveBusz],fnSym=[${fnSym}]`)

  //调用本地函数 func01_return_int
  if(nativeFn__func01_return_int){
    const ret_int:number=nativeFn__func01_return_int(32,-33); //结果应该是-9
    console.log(`[nativeFn__func01_return_int],ret_int=[${ret_int}]`)
  }

  //调用本地函数 func01_return_int
  if(nativeFn__func03_return_structUser){
    const ret_structUser:T_User=nativeFn__func03_return_structUser(4,'M'.charCodeAt(0)) ;
    // const userId:number = ptr_ret_structUser.readShort();
    // const salary:number = ptr_ret_structUser.add(C_Lang__sizeof_short).readFloat();
    // console.log(`[ret_structUser],{userId=${userId},salary=${salary}}`)
    console.log(`ret_structUser.salary=${ret_structUser.salary}`)
  }
}

function _main_(){

  //获取本地函数func01_return_int
  const func01_return_int:NativePointer = DebugSymbol.fromName("func01_return_int").address;
  nativeFn__func01_return_int=  new NativeFunction(func01_return_int, 'int',['char','double']);
  console.log(`##func01_return_int=${nativeFn__func01_return_int}`)

  //获取 本地函数 func03_return_structUser
  const func03_return_structUser:NativePointer = DebugSymbol.fromName("func03_return_structUser").address;
  nativeFn__func03_return_structUser=  new NativeFunction(func03_return_structUser, 'T_User',['char','double']); //函数返回类型中无法表达 自定义结构体 T_User
  /* frida网站 2019年 有人提出了改进需求 将    "C structs" 和  JavaScript objects 做对应 ，但该需求始终是Open的， 这说明frida目前无法调用 调用返回类型为 结构体的本地c函数
  Map between "C structs" and JavaScript objects #1099  
https://github.com/frida/frida/issues/1099

  */
  console.log(`##func03_return_structUser=${nativeFn__func03_return_structUser}`)

  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  console.log(`fnAdrLs.length=${fnAdrLs.length}`)
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    if(!focus_fnAdr(fnAdr)){
      continue;
    }

    console.log(`关注函数 ${fnAdr}`)
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
  _main_()

}, 0);
