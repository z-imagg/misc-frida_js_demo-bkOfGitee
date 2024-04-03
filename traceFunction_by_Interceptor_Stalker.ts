////文件traceFunction_by_Interceptor_Stalker.ts

//来自 https://gitee.com/x619920921/frida-js/blob/main/frida-trace.js
// 已修改为ts样式

// 打印调用堆栈
function traceFunction(addr:NativePointer, base_addr:NativePointer){
    
    let moduleMap = new ModuleMap();
    const module=moduleMap.find(addr);
    if(module==null || module==undefined){
        return;
    }
    let base_size = module.size;

    Interceptor.attach(addr, {
        onEnter: function(this: InvocationContext, args: InvocationArguments) {

    console.log(`Context  :  ${JSON.stringify(this.context)} ; 返回地址returnAddress   :  ${this.returnAddress} ; ThreadId :  ${this.threadId} ; 调用栈深度Depth    :  ${this.depth} ; Errornr  :  ${this.err}`);

    //打印当前函数地址
    const fnAdr = this.context.pc;
    const fnSym=DebugSymbol.fromAddress(fnAdr);
    const fnSymJsonTxt=JSON.stringify(fnSym)
    console.log(`fnAdr_OnEnter:${fnAdr}, DebugSymbol: ${fnSymJsonTxt}`)

    //打印当前函数的返回地址
    const retAdr = this.returnAddress;
    const retSym=DebugSymbol.fromAddress(retAdr);
    const retSymJsonTxt=JSON.stringify(retSym)
    console.log(`retAdr_OnEnter:${retAdr}, DebugSymbol: ${retSymJsonTxt}`)


            this.tid = Process.getCurrentThreadId();
            
        }, onLeave: function(this: InvocationContext, retval: InvocationReturnValue) {
            Stalker.unfollow(this.tid);
        }
    })
}


/*

尝试 用 traceFunction_by_Interceptor_Stalker.ts 打印 "下一个 孤立点群" 中的起点函数 _ZN5torch3jit6tracer13ArgumentStashD1Ev 0x7ffff766da32 的调用栈

目标是 跟踪 文档
http://giteaz:3000/frida_analyze_app_src/analyze_by_graph/src/commit/b5c7de3a578655eb83bc29a5ac48dfb354bfa073/result.md
提出的 "下一个 孤立点群" 中 函数 ，具体如下

╒══════════════════════════════════════════════════════════════════════╕
│v                                                                     │
╞══════════════════════════════════════════════════════════════════════╡
│(:V_FnCallLog {fnSym_lineNumber: 0,fnCallId: 229372,fnSym_address: "0x│
│7ffff766da32",fnSym_column: 0,fnAdr: "0x7ffff766da32",fnSym_name: "_ZN│
│5torch3jit6tracer13ArgumentStashD1Ev",tmPnt: 458742,direct: 1,fnSym_mo│
│duleName: "libtorch.so.1",logId: 458742,fnSym_fileName: "",curThreadId│
│: 11557})                                                             │
├──────────────────────────────────────────────────────────────────────┤

大致调用语句如下:
traceFunctionWrap("0x7ffff766da32","libtorch.so.1")
*/

function traceFunctionWrap(fnAdrTxt:string,target_moduleName:string){
    // const fnAdrTxt:string="0x7ffff766da32";
    const fnAdr=new NativePointer(fnAdrTxt)
    const fnSym=DebugSymbol.fromAddress(fnAdr);
    const fnSymJsonTxt=JSON.stringify(fnSym)
    console.log(`fnSym_traceFunctionWrap:${fnAdrTxt}, ${fnSymJsonTxt}`)

    const moduleName:string|null=fnSym.moduleName;
    if(moduleName==null||moduleName==undefined){
        console.log(`退出，因为模块名为空.地址${fnAdrTxt}写错了？`)
        return;
    }
    if(moduleName!=target_moduleName){
        console.log(`退出，因为模块名不同. 目标模块名=${target_moduleName}, 地址${fnAdrTxt}的模块名${moduleName}`)
        return;

    }
    const module:Module=Process.getModuleByName(moduleName)
    const module_baseAdr=module.base;

    //尝试打印该函数调用栈
    traceFunction(fnAdr,module_baseAdr);
}


// 打印函数  _ZN5torch3jit6tracer13ArgumentStashD1Ev 0x7ffff766da32 调用栈
traceFunctionWrap("0x7ffff766da32","libtorch.so.1")

/* 运行 bash   traceFunction_run.sh ，输出如下:

Spawning `/fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf`...               
fnSym_traceFunctionWrap:0x7ffff766da32, {"address":"0x7ffff766da32","name":"_ZN5torch3jit6tracer13ArgumentStashD1Ev","moduleName":"libtorch.so.1","fileName":"","lineNumber":0,"column":0}
Spawned `/fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf`. Resuming main thread!
[Local::simple_nn.elf ]-> Output Tensor:  0.1386 -0.4827  0.1269 -0.0685 -0.0272  0.0821  0.0785  0.6181 -0.0262  0.0397
-0.0992  0.1011  0.2460 -0.0704  0.1555 -0.1089 -0.1402  0.5968 -0.0470 -0.0401
-0.2823  0.0758  0.1778  0.1900 -0.2641 -0.0145  0.0480  0.6706 -0.3447  0.0226
-0.2822 -0.1493  0.0282 -0.3610  0.0147 -0.0944  0.0223  0.4218  0.0296 -0.1638
-0.0074  0.2171  0.3331  0.1860 -0.0489 -0.1112  0.0765  0.3027  0.0966 -0.1042
[ Variable[CPUFloatType]{5,10} ]
Context  :  {"pc":"0x7ffff766da32","sp":"0x7fffffffd988","rax":"0x7ffff766da32","rcx":"0x1","rdx":"0x5555557821f0","rbx":"0xfffffffffffffe30","rsp":"0x7fffffffd988","rbp":"0x55555586f550","rsi":"0x7ffff221a838","rdi":"0x7ffff264c838","r8":"0x5555559e1ca0","r9":"0x7fffffffd500","r10":"0x555555555f60","r11":"0x86ca2c97ef53121c","r12":"0x7ffff221a838","r13":"0x555555565d4a","r14":"0x55555557d718","r15":"0x7ffff7ffd040","rip":"0x7ffff766da32"} ; 返回地址returnAddress   :  0x7ffff2045d9f ; ThreadId :  19098 ; 调用栈深度Depth    :  1 ; Errornr  :  undefined
fnAdr_OnEnter:0x7ffff766da32, DebugSymbol: {"address":"0x7ffff766da32","name":"_ZN5torch3jit6tracer13ArgumentStashD1Ev","moduleName":"libtorch.so.1","fileName":"","lineNumber":0,"column":0}
retAdr_OnEnter:0x7ffff2045d9f, DebugSymbol: {"address":"0x7ffff2045d9f","name":"__call_tls_dtors+0x3f","moduleName":"libc.so.6","fileName":"","lineNumber":0,"column":0}
Process terminated
[Local::simple_nn.elf ]->

Thank you for using Frida!
frida退出代码=1




*/



/*
函数 _ZN5torch3jit6tracer13ArgumentStashD1Ev 经demangle解码（http://demangler.com/）后为  torch::jit::tracer::ArgumentStash::~ArgumentStash()

进入 函数  torch::jit::tracer::ArgumentStash::~ArgumentStash()   0x7ffff766da32 内 ， 

   调用栈深度Depth为1, 表明该函数的上层只有1个函数

   而 返回地址returnAddress  == 0x7ffff2045d9f == "__call_tls_dtors+0x3f" 
     而 __call_tls_dtors == 调用线程本地存储（TLS）相关的析构函数

     通常情况下，  __call_tls_dtors 函数不会由用户直接调用，而是由编译器生成并在适当的时机调用。该函数的具体实现可能取决于编译器和操作系统的不同。

   由此 可知 函数  __call_tls_dtors 是孤立的  而被 __call_tls_dtors 调用的 函数 _ZN5torch3jit6tracer13ArgumentStashD1Ev 'torch::jit::tracer::ArgumentStash::~ArgumentStash()'  0x7ffff766da32 当然 也就是孤立的了 ， 这是正常的


   由此可知 frida_js 需要 拦截 __call_tls_dtors 能聚拢 因 没拦截 __call_tls_dtors 导致的 若干孤立群


  
 */