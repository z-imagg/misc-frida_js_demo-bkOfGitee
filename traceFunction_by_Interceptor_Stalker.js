//来自 https://gitee.com/x619920921/frida-js/blob/main/frida-trace.js
// 已修改为ts样式
// 打印调用堆栈
function traceFunction(addr, base_addr) {
    let moduleMap = new ModuleMap();
    const module = moduleMap.find(addr);
    if (module == null || module == undefined) {
        return;
    }
    let base_size = module.size;
    Interceptor.attach(addr, {
        onEnter: function (args) {
            console.log(`Context  :  ${JSON.stringify(this.context)} ; 返回地址returnAddress   :  ${this.returnAddress} ; ThreadId :  ${this.threadId} ; 调用栈深度Depth    :  ${this.depth} ; Errornr  :  ${this.err}`);
            //打印当前函数地址
            const fnAdr = this.context.pc;
            const fnSym = DebugSymbol.fromAddress(fnAdr);
            const fnSymJsonTxt = JSON.stringify(fnSym);
            console.log(`fnAdr_OnEnter:${fnAdr}, DebugSymbol: ${fnSymJsonTxt}`);
            //打印当前函数的返回地址
            const retAdr = this.returnAddress;
            const retSym = DebugSymbol.fromAddress(retAdr);
            const retSymJsonTxt = JSON.stringify(retSym);
            console.log(`retAdr_OnEnter:${retAdr}, DebugSymbol: ${retSymJsonTxt}`);
            this.tid = Process.getCurrentThreadId();
            Stalker.follow(this.tid, {
                events: {
                    call: true
                },
                onReceive: function (events) {
                    console.log(`events:${events}`);
                    let allEvents = Stalker.parse(events);
                    let first_depth = 0;
                    let is_first = true;
                    for (let i = 0; i < allEvents.length; i++) {
                        const evt = allEvents[i];
                        // 调用的流程, location是哪里发生的调用, target是调用到了哪里
                        if (allEvents[i][0] === "call") {
                            const scEvt = evt;
                            // let location = allEvents[i][1]; // 调用地址
                            // let target = allEvents[i][2];   // 目标地址
                            // let depth = allEvents[i][3];    // depth
                            let location = scEvt[1]; // 调用地址
                            let target = scEvt[2]; // 目标地址
                            let depth = scEvt[3]; // depth
                            let description = '';
                            let space_num = '';
                            if (target.compare(base_addr) >= 0 && target.compare(base_addr.add(base_size)) < 0) {
                                if (is_first) {
                                    is_first = false;
                                    first_depth = depth;
                                }
                                let location_description = ' [' + location.sub(base_addr) + '] ';
                                let target_description = ' [' + target.sub(base_addr) + ']';
                                let length = (depth - first_depth);
                                for (let j = 0; j < length; j++) {
                                    space_num = space_num + ' ';
                                }
                                description = space_num + target_description + '(' + location_description + ')' + ' -- ' + length;
                                console.log(description);
                            }
                        }
                    }
                }
            });
        }, onLeave: function (retval) {
            Stalker.unfollow(this.tid);
        }
    });
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
function traceFunctionWrap(fnAdrTxt, target_moduleName) {
    // const fnAdrTxt:string="0x7ffff766da32";
    const fnAdr = new NativePointer(fnAdrTxt);
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    const fnSymJsonTxt = JSON.stringify(fnSym);
    console.log(`fnSym_traceFunctionWrap:${fnAdrTxt}, ${fnSymJsonTxt}`);
    const moduleName = fnSym.moduleName;
    if (moduleName == null || moduleName == undefined) {
        console.log(`退出，因为模块名为空.地址${fnAdrTxt}写错了？`);
        return;
    }
    if (moduleName != target_moduleName) {
        console.log(`退出，因为模块名不同. 目标模块名=${target_moduleName}, 地址${fnAdrTxt}的模块名${moduleName}`);
        return;
    }
    const module = Process.getModuleByName(moduleName);
    const module_baseAdr = module.base;
    //尝试打印该函数调用栈
    traceFunction(fnAdr, module_baseAdr);
}
// 打印函数  _ZN5torch3jit6tracer13ArgumentStashD1Ev 0x7ffff766da32 调用栈
traceFunctionWrap("0x7ffff766da32", "libtorch.so.1");
