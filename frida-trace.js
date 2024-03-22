📦
1968 /frida-trace.js.map
3708 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AACA,aAAa;AACb,MAAM,SAAS,GAAkC,IAAI,GAAG,EAAE,CAAC;AAC3D,UAAU;AACV,SAAS,cAAc;IACnB,QAAQ;IACR,yEAAyE;IAEzE,uDAAuD;IACvD,eAAe;IACf,MAAM,YAAY,GAAiB,WAAW,CAAC,qBAAqB,CAAC,GAAG,CAAC,CAAA;IACzE,OAAO,CAAC,GAAG,CAAC,aAAa,YAAY,CAAC,MAAM,EAAE,CAAC,CAAA;IAE/C,IAAI,CAAC,GAAU,CAAC,CAAC;IACjB,cAAc;IACd,KAAK,IAAI,MAAM,IAAI,YAAY,EAAE;QAC7B,iDAAiD;QACjD,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,EAAE,UAAU,MAAM,EAAE,CAAC,CAAC;QAExC,UAAU;QACV,MAAM,MAAM,GAAa,WAAW,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC;QAEzD,MAAM,KAAK,GAAa,MAAM,CAAC,UAAU,CAAC;QAC1C,MAAM,MAAM,GAAa,MAAM,CAAC,QAAQ,CAAC;QACzC,GAAG;QACH;QACI,0BAA0B;QAC1B,MAAM,IAAI,IAAI,IAAI,MAAM,IAAI,SAAS,IAAI,MAAM,IAAI,EAAE;YACrD,+BAA+B;YAC/B,MAAM,EAAE,UAAU,CAAC,kBAAkB,CAAC;YACtC,MAAM,EAAE,UAAU,CAAC,mCAAmC,CAAC,EAC1D;YACG,SAAS;SACZ;QAED,SAAS;QACT,OAAO,CAAC,GAAG,CAAC,IAAI,CAAC,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC;QAEpC,oCAAoC;QACpC,SAAS,CAAC,GAAG,CAAC,MAAM,EAAE,MAAM,CAAC,CAAC;QAE9B,IAAG,SAAS,CAAC,IAAI,GAAG,IAAI,IAAI,CAAC,EAAE;YAC3B,OAAO,CAAC,GAAG,CAAC,UAAU,SAAS,CAAC,IAAI,EAAE,CAAC,CAAA;SAC1C;KAEJ;AAGL,CAAC;AAED,mBAAmB;AACnB,SAAS,aAAa;IAClB,MAAM,OAAO,GAAC,SAAS,CAAC,IAAI,EAAE,CAAC;IAC/B,KAAK,IAAI,MAAM,IAAI,OAAO,EAAE;QAExB,oDAAoD;QACpD,WAAW,CAAC,MAAM,CAAC,MAAM,EAAE;YACzB,OAAO,EAAE,UAAe,IAAI;gBAC1B,cAAc;gBAClB,gCAAgC;gBAC5B,uCAAuC;gBACvC,OAAO,CAAC,GAAG,CAAC,aAAa,GAAG,IAAI,CAAC,SAAS,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC;gBAC1D,OAAO,CAAC,GAAG,CAAC,aAAa,GAAG,IAAI,CAAC,aAAa,CAAC,CAAC;gBAChD,OAAO,CAAC,GAAG,CAAC,aAAa,GAAG,IAAI,CAAC,QAAQ,CAAC,CAAC;gBAC3C,OAAO,CAAC,GAAG,CAAC,aAAa,GAAG,IAAI,CAAC,KAAK,CAAC,CAAC;gBACxC,OAAO,CAAC,GAAG,CAAC,aAAa,GAAG,IAAI,CAAC,GAAG,CAAC,CAAC;YACxC,CAAC;YACD,OAAO,CAAM,MAAM;gBACjB,+CAA+C;gBAC/C,wCAAwC;gBACxC,iDAAiD;YACnD,CAAC;SACF,CAAC,CAAC;KACF;AACT,CAAC;AACD;;;;;;GAMG;AACH,0EAA0E;AAC1E,UAAU,CAAC;IACP,MAAM;IACN,cAAc,EAAE,CAAA;IAChB,aAAa,EAAE,CAAA;AACjB,CAAC,EAAE,CAAC,CAAC,CAAC;AAGR;;;;;;;;;;;;;;GAcG"}
✄
//函数符号表格 全局变量
const gFnSymTab = new Map();
//填充函数符号表格
function createFnSymTab() {
    //打印模块列表
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))
    // const Mod=Process.findModuleByName("libtorch.so.1");
    //获取调试信息中全部函数地址
    const fnLsInDbgSym = DebugSymbol.findFunctionsMatching("*");
    console.log(`调试信心中函数个数=${fnLsInDbgSym.length}`);
    let k = 0;
    //遍历调试信息中的全部函数
    for (let fnAdrK of fnLsInDbgSym) {
        //想要通过日志打印 人工知道 哪个函数的 DebugSymbol.fromAddress 很卡？
        console.log(`k=${k++},fnAdr=${fnAdrK}`);
        //函数地址k的详情
        const fnSymK = DebugSymbol.fromAddress(fnAdrK);
        const modNm = fnSymK.moduleName;
        const fileNm = fnSymK.fileName;
        // 
        if (
        // 忽略 空文件名, 空文件名的是其他用途的符号？
        fileNm == null || fileNm == undefined || fileNm == "" ||
            // 忽略/usr/include/c++/等下的相关源文件名
            fileNm?.startsWith("/usr/include/c++") ||
            fileNm?.startsWith("/usr/include/x86_64-linux-gnu/c++")) {
            continue;
        }
        //打印函数地址k
        console.log(JSON.stringify(fnSymK));
        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        gFnSymTab.set(fnAdrK, fnSymK);
        if (gFnSymTab.size % 1000 == 0) {
            console.log(`函数表格尺寸:${gFnSymTab.size}`);
        }
    }
}
//拦截 函数符号表格 中的 每个函数
function interceptFnLs() {
    const fnAdrLs = gFnSymTab.keys();
    for (let fnAdrK of fnAdrLs) {
        // https://frida.re/docs/javascript-api/#interceptor
        Interceptor.attach(fnAdrK, {
            onEnter: function (args) {
                // send(args);
                //    console.log('args:'+args);
                // console.log('Context information:');
                console.log('Context  : ' + JSON.stringify(this.context));
                console.log('Return   : ' + this.returnAddress);
                console.log('ThreadId : ' + this.threadId);
                console.log('Depth    : ' + this.depth);
                console.log('Errornr  : ' + this.err);
            },
            onLeave(retval) {
                // Show argument 1 (buf), saved during onEnter.
                // const retvalInt32 = retval.toInt32();
                // console.log('retvalInt32   : ' + retvalInt32);
            }
        });
    }
}
/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
    //业务代码
    createFnSymTab();
    interceptFnLs();
}, 0);
/**
调试信心中函数个数=289146
调试信息中的新模块，simple_nn.elf
调试信息中的新模块，linux-vdso.so.1
调试信息中的新模块，frida-agent-64.so
调试信息中的新模块，libopen-rte.so.40.30.2
调试信息中的新模块，libc.so.6
调试信息中的新模块，libudev.so.1.7.2
调试信息中的新模块，libmpi.so.40.30.2
调试信息中的新模块，libstdc++.so.6.0.30
调试信息中的新模块，libz.so.1.2.11
调试信息中的新模块，libopen-pal.so.40.30.2
调试信息中的新模块，libm.so.6
调试信息中的新模块，libcaffe2.so  #此模块中函数太多，很耗时，等不起
 */